package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func getTasks(w http.ResponseWriter, _ *http.Request) {

	w.Header().Set(
		"Access-Control-Allow-Origin",
		"*",
	)

	file, err := os.ReadFile("tasks.json")

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	w.Write(file)
}

func saveTasks(w http.ResponseWriter, r *http.Request) {

	w.Header().Set(
		"Access-Control-Allow-Origin",
		"*",
	)

	body, err := io.ReadAll(r.Body)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	err = os.WriteFile(
		"tasks.json",
		body,
		0644,
	)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write([]byte("saved"))
}

func main() {
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

	err := http.ListenAndServe(":"+port, mux)
	if err != nil {
		fmt.Println(err)
	}
}
