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

	http.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set(
			"Access-Control-Allow-Origin",
			"*",
		)

		w.Header().Set(
			"Access-Control-Allow-Methods",
			"GET, POST, OPTIONS",
		)

		w.Header().Set(
			"Access-Control-Allow-Headers",
			"Content-Type",
		)

		if r.Method == "OPTIONS" {
			return
		}

		if r.Method == "GET" {
			getTasks(w, r)
			return
		}

		if r.Method == "POST" {
			saveTasks(w, r)
			return
		}
	})

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	fmt.Println("server start:", port)

	http.ListenAndServe(":"+port, nil)
}
