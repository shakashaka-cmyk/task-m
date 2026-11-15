import { useEffect, useState } from "react";
import type { Task } from "../task";
import { getTasks } from "../api";
import TaskList from "./TaskList.tsx";

type View = "list" | "add";

function MainScreen () {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [view, setView] = useState<View>("list");

    const loadTasks = async () => {
        try {
        const data = await getTasks();
        setTasks(data);
        } catch {
        alert("タスクの取得に失敗しました");
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const incompleteTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);

    if (view === "add") {
    return (
      <AddTaskForm
        onAdded={async () => {
          await loadTasks();
          setView("list");
        }}
        onCancel={() => setView("list")}
      />
    );
  }

    return (
    <div id="app-display">
      <div id="displaying">
        <h2>課題一覧</h2>
        <TaskList id="task-list" tasks={incompleteTasks} />
        <div>
          <button id="add-button" type="button" onClick={() => setView("add")}>
            課題を追加
          </button>
        </div>

        <h2>達成済課題</h2>
        <TaskList id="end-list" tasks={completedTasks} />
      </div>
    </div>
  );
}
export default MainScreen