import { useEffect, useState } from "react";
import type { Task } from "../task";
import { getTasks } from "../api";
import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm"
import EditTaskForm from "./EditTaskForm";

type View = "list" | "add" | "edit";

function MainScreen () {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [view, setView] = useState<View>("list");
    const [editingTask, setEditingTask] = useState<Task | null>(null);


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

     const backToList = () => {
    setEditingTask(null);
    setView("list");
  };

  const reloadAndBackToList = async () => {
    await loadTasks();
    backToList();
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setView("edit");
  };

    const incompleteTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);

     if (view === "add") {
    return <AddTaskForm onAdded={reloadAndBackToList} onCancel={backToList} />;
  }

  if (view === "edit" && editingTask) {
    return (
      <EditTaskForm
        task={editingTask}
        onChanged={reloadAndBackToList}
        onCancel={backToList}
      />
    );
  }

    return (
    <div id="app-display">
      <div id="displaying">
        <h2>課題一覧</h2>
        <TaskList id="task-list" tasks={incompleteTasks} onEdit={startEdit}/>
        <div>
          <button id="add-button" type="button" onClick={() => setView("add")}>
            課題を追加
          </button>
        </div>

        <h2>達成済課題</h2>
        <TaskList id="end-list" tasks={completedTasks} onEdit={startEdit}/>
      </div>
    </div>
  );
}
export default MainScreen