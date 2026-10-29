import type { Task } from "./task";


export async function getTasks() : Promise<Task[]> {

    const response =
    await fetch("/tasks", {
    headers: {
        "Authorization": "Bearer " + getToken()
    }
})

    if (!response.ok) {
        throw new Error("タスク取得失敗");
    }

    const data: Task[] = await response.json();
    return data ?? [];
}

export async function deleteTask(id: number) {
    const response = await fetch(
        "/tasks/" + id,
         {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        }
    )
    if (!response.ok) {
        throw new Error("削除失敗");
    }
}

export async function updateTask(task: Task) {
    const response = await fetch(
        "/tasks/" + task.id,
 {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            },

            body: JSON.stringify(task)
    })
    if (!response.ok) {
        throw new Error("更新失敗");
    }
}

export type NewTask = Omit<Task, "id">;

export async function createTask(task: NewTask) {
    const response = await fetch(
        "/tasks",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            },
            body: JSON.stringify(task)
        }
    );
    if (!response.ok) {
        throw new Error("作成失敗");
    }
}

function getToken(): string {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("no token");
    }
    return token;
}

export async function register(username: string, password: string): Promise<void> {
    const response = await fetch(
        "/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            }),
        });
         if (!response.ok) throw new Error("登録失敗");
}

export async function login(username: string, password: string):Promise<string> {
    const response = await fetch(
        "/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });
    if (!response.ok) throw new Error("ログイン失敗");    
    const data = await response.json();
    return data.token;
}
  