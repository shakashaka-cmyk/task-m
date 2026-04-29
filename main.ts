import type { Task } from "./task";

const addTaskDisplay = document.getElementById("add-task-display");
const addButton = document.getElementById("add-button");
const displaying = document.getElementById("displaying");
const tasklist = document.getElementById("task-list");  
const endlist = document.getElementById("end-list");
const addTaskForm = document.getElementById("add-task-form") as HTMLFormElement;
const editTaskDisplay = document.getElementById("edit-task-display");
const editTaskButton = document.getElementById("edit-task-button");
const editCancelButton = document.getElementById("edit-cancel-button");
const deleteTaskButton = document.getElementById("delete-task-button");
const completeTaskButton = document.getElementById("complete-task-button");

//課題追加フォームへの遷移
if (addButton && addTaskDisplay && displaying) { 
    addButton.addEventListener('click', () => {
        displaying.style.display = "none";
        addTaskDisplay.style.display = "block";

        addTaskForm.reset();
    })
};

//課題追加フォームの送信イベント
addTaskDisplay?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const deadline = (document.getElementById("deadline") as HTMLInputElement).value;
    const importance = Number(
    (document.getElementById("importance") as HTMLSelectElement).value
  );

  const task: Task = {          
    id: Date.now(),
    title,
    deadline,
    importance: importance as 3 | 2 | 1,
    completed: false
    }
    BackDisplay();
    tasks.push(task);
    renderAllTasks();

});

//タスク表示
let editingTaskId: number | null = null; //編集中のタスクIDを保持
let tasks: Task[] = [];

const renderAllTasks = () => {
    if (!displaying || !tasklist || !editTaskDisplay || !completeTaskButton ||!endlist) return;

    if (!tasklist) return;
    if (!endlist) return;

    tasklist.innerHTML = "";
    endlist.innerHTML ="";
    tasks.forEach(task=>{
        const li = document.createElement("li");
        const editButton = document.createElement("button");
        //編集ボタンのUI・機能作成
        editButton.textContent = "編集";
        editButton.addEventListener("click", () => {
        displaying.style.display = "none";
        editTaskDisplay.style.display = "block";

            (document.getElementById("edit-title") as HTMLInputElement).value = task.title;
            (document.getElementById("edit-deadline") as HTMLInputElement).value = task.deadline;
            (document.getElementById("edit-importance") as HTMLSelectElement).value = String(task.importance);
            (document.getElementById("complete-task-button") as HTMLButtonElement).textContent = task.completed ? "未完了に戻す" : "完了";
            editingTaskId = task.id;
        });
        completeTaskButton.textContent = task.completed ? "未完了に戻す" : "完了";
        completeTaskButton.addEventListener("click", () => {
            task.completed = !task.completed;
            renderAllTasks();
        })
        li.textContent = `${task.title} | ${task.deadline} | ${renderTaskImportance(task.importance)} | ${task.completed ? "完了" : "未完了"}`;
        li.appendChild(editButton);
        if ((endlist) && (task.completed)) {
            endlist.appendChild(li);
        } else {
            tasklist.appendChild(li);
        }
    })
}

//タスクの重要性表示
const renderTaskImportance = (importance: 3 | 2 | 1): string => {
    switch (importance) {
        case 3:
            return "高";
        case 2:
            return "中";
        case 1:
            return "低";
    }
}

//displayingへの切り替え
function BackDisplay() {
    if ((displaying && addTaskDisplay) && (addTaskDisplay.style.display === "block")) {
        displaying.style.display = "block";
        addTaskDisplay.style.display = "none";
    } else if ((displaying && editTaskDisplay) && (editTaskDisplay.style.display === "block")) {
        displaying.style.display = "block";
        editTaskDisplay.style.display = "none";
    }
}

//editTaskButtonのアドイベ
if (editTaskButton && editTaskDisplay && displaying) {      
editTaskDisplay.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = (document.getElementById("edit-title") as HTMLInputElement).value;
    const deadline = (document.getElementById("edit-deadline") as HTMLInputElement).value;
    const importance = Number(
    (document.getElementById("edit-importance") as HTMLSelectElement).value
  ) as 1|2|3;

    const task = tasks.find(t => t.id === editingTaskId)
    if (!task) return;

    task.title = title;
    task.deadline = deadline;
    task.importance = importance;

    renderAllTasks();
    BackDisplay();
})}

//editCancelButtonのアドイベ
if (editCancelButton) {
    editCancelButton.addEventListener("click", () => {
        BackDisplay();
    })
}

//deleteTaskButtonのアドイベ
if (deleteTaskButton) {
    deleteTaskButton.addEventListener("click", () => {
        if (editingTaskId === null) return;
        tasks = tasks.filter(t => t.id !== editingTaskId);
        renderAllTasks();
        BackDisplay();
    })
}

//達成課題の移動