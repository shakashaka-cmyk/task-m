package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

func getTasks(w http.ResponseWriter, _ *http.Request) {

	rows, err := db.Query(`
		SELECT id, title, completed
		FROM tasks
	`)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	defer rows.Close()

	type Task struct {
		ID        int    `json:"id"`
		Title     string `json:"title"`
		Completed bool   `json:"completed"`
	}

	var tasks []Task

	for rows.Next() {

		var task Task

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Completed,
		)

		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		tasks = append(tasks, task)
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(tasks)

}

func saveTasks(w http.ResponseWriter, r *http.Request) {

	w.Header().Set(
		"Access-Control-Allow-Origin",
		"*",
	)

	type Task struct {
		Title string `json:"title"`
	}

	var task Task

	err := json.NewDecoder(r.Body).Decode(&task)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	_, err = db.Exec(`
		INSERT INTO tasks (title, completed)
		VALUES (?, ?)
	`,
		task.Title,
		false,
	)

	w.Write([]byte("saved"))
}

var db *sql.DB

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
		completed BOOLEAN
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

	mux.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {

		if r.Method == "GET" {
			getTasks(w, r)
			return
		}

		if r.Method == "POST" {
			saveTasks(w, r)
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
