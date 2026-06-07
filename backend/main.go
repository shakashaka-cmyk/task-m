package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	_ "github.com/mattn/go-sqlite3"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func getTasks(w http.ResponseWriter, r *http.Request) {

		userID, err := getUserID(r)

	if err != nil {
		http.Error(w, "unauthorized", 401)
		return
	}

	rows, err := db.Query(`
		SELECT id, title, deadline, importance, completed
		FROM tasks
		WHERE user_id = ?
	`,
		userID,)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	defer rows.Close()

	type Task struct {
		ID         int    `json:"id"`
		Title      string `json:"title"`
		Deadline   string `json:"deadline"`
		Importance int    `json:"importance"`
		Completed  bool   `json:"completed"`
	}

	var tasks []Task

	for rows.Next() {

		var task Task

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Deadline,
			&task.Importance,
			&task.Completed,
		)

		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		tasks = append(tasks, task)
	}

	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	err = json.NewEncoder(w).Encode(tasks)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}

func createTask(w http.ResponseWriter, r *http.Request) {

	w.Header().Set(
		"Access-Control-Allow-Origin",
		"*",
	)


	userID, err := getUserID(r)

	if err != nil {
		http.Error(w, "unauthorized", 401)
		return
	}

	type Task struct {
		Title      string `json:"title"`
		Deadline   string `json:"deadline"`
		Importance int    `json:"importance"`
		Completed  bool   `json:"completed"`
	}

	var task Task

	err = json.NewDecoder(r.Body).Decode(&task)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	_, err = db.Exec(`
		INSERT INTO tasks (title, deadline, importance, completed, user_id)
		VALUES (?, ?, ?, ?, ?)
	`,
		task.Title,
		task.Deadline,
		task.Importance,
		task.Completed,
		userID,
	)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write([]byte("saved"))
}

func deleteTask(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	parts := strings.Split(path, "/")
	id, err := strconv.Atoi(parts[2])
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	userID, err := getUserID(r)
	if err != nil {
		http.Error(w, "unauthorized", 401)
		return
	}

	_, err = db.Exec(`
		DELETE FROM tasks
		WHERE id = ?
		AND user_id = ?
    `,
		id,
		user_id,
	)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write([]byte("deleted"))
}

func updateTask(w http.ResponseWriter, r *http.Request) {

	path := r.URL.Path
	parts := strings.Split(path, "/")
	id, err := strconv.Atoi(parts[2])
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	type Task struct {
		Title      string `json:"title"`
		Deadline   string `json:"deadline"`
		Importance int    `json:"importance"`
		Completed  bool   `json:"completed"`
	}

	userID, err := getUserID(r)
	if err != nil {
		http.Error(w, "unauthorized", 401)
		return
	}
	var task Task

	err = json.NewDecoder(r.Body).Decode(&task)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	_, err = db.Exec(`
		UPDATE tasks
		Set title = ?, deadline = ?, importance = ?, completed = ?
		WHERE id = ?
		AND user_id = ?
    `,
		task.Title,
		task.Deadline,
		task.Importance,
		task.Completed,
		id,
		user_id,
	)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write([]byte("updated"))
}

func registerUser(w http.ResponseWriter, r *http.Request) {

	type RegisterRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var req RegisterRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	hash, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	_, err = db.Exec(`
		INSERT INTO users (
			username,
			password_hash
		)
		VALUES(?, ?)
`,
		req.Username,
		string(hash),
	)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write([]byte("registered"))
}

func  getUserID(r *http.Request) (int, error) {
	authHeader := r.Header.Get("Authorization")

	tokenString := strings.TrimPrefix(
		authHeader,
		"Bearer ",
	)

	token, err := jwt.Parse(
		tokenString,
		func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		},
	)

	if err != nil {
		return 0, err
	}

	claims := token.Claims.(jwt.MapClaims)

	userID := int(
		claims["user_id"].(float64),
	)

	return userID, nil
}

func loginUser(w http.ResponseWriter, r *http.Request) {
	type LoginRequest struct {
		Username string `json:"username"`
        Password string `json:"password"`
	}

	var req LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
        http.Error(w, err.Error(), 400)
        return
    }

	var userID int 
	var passwordHash string

	err = db.QueryRow(`
        SELECT id, password_hash
        FROM users
        WHERE username = ?
    `,
        req.Username,
    ).Scan(
        &userID,
        &passwordHash,
    )

	if err != nil {
        http.Error(w, "invalid username", 401)
        return
    }

	 err = bcrypt.CompareHashAndPassword(
        []byte(passwordHash),
        []byte(req.Password),
    )

    if err != nil {
        http.Error(w, "invalid password", 401)
        return
    }

	token := jwt.NewWithClaims(
	jwt.SigningMethodHS256,
	jwt.MapClaims{
		"user_id": userID,
	},
)

	tokenString, err := token.SignedString(
		[]byte(jwtSecret),
	)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenString,
	})
}

var db *sql.DB
const jwtSecret = "super-secret-key"

func main() {
	var err error

	db, err = sql.Open(
		"sqlite3",
		"./app.db",
	)

	if err != nil {
		panic(err)
	}

	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS tasks (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		deadline TEXT,
		importance INTEGER,
		completed BOOLEAN,
		user_id INTEGER
	)
	`)

	if err != nil {
		panic(err)
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL
		)
	`)

	if err != nil {
		panic(err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {

		if r.Method == "POST" {
			registerUser(w, r)
			return
		}

		http.Error(w, "Method Not Allowed", 405)
	})

	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {

    if r.Method == "POST" {
			loginUser(w, r)
			return
		}

		http.Error(w, "Method Not Allowed", 405)
	})

	mux.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {

		if r.Method == "GET" {
			getTasks(w, r)
			return
		}

		if r.Method == "POST" {
			createTask(w, r)
			return
		}
	})

	mux.HandleFunc("/tasks/", func(w http.ResponseWriter, r *http.Request) {

		if r.Method == "DELETE" {
			deleteTask(w, r)
			return
		}

		if r.Method == "PUT" {
			updateTask(w, r)
			return
		}
	})

	fs := http.FileServer(http.Dir("/home/ubuntu/task-m/frontend/dist"))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		path := "/home/ubuntu/task-m/frontend/dist" + r.URL.Path

		if _, err := os.Stat(path); os.IsNotExist(err) {
			http.ServeFile(w, r, "/home/ubuntu/task-m/frontend/dist/index.html")
			return
		}

		fs.ServeHTTP(w, r)
	})

	fmt.Println("server start:", port)

	err = http.ListenAndServe(":"+port, mux)
	if err != nil {
		fmt.Println(err)
	}
}
