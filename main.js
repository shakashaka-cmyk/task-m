const addTaskDisplay = document.getElementById("add-task-display");
const addButton = document.getElementById("add-button");
const displaying = document.getElementById("displaying");
const tasklist = document.getElementById("task-list");
const endlist = document.getElementById("end-list");
const addTaskForm = document.getElementById("add-task-form");
const editTaskDisplay = document.getElementById("edit-task-display");
const editTaskButton = document.getElementById("edit-task-button");
const editCancelButton = document.getElementById("edit-cancel-button");
const deleteTaskButton = document.getElementById("delete-task-button");
const completeTaskButton = document.getElementById("complete-task-button");
const calendar = document.getElementById("calendar");
//課題追加フォームへの遷移
if (addButton && addTaskDisplay && displaying) {
    addButton.addEventListener('click', () => {
        displaying.style.display = "none";
        addTaskDisplay.style.display = "block";
        addTaskForm.reset();
    });
}
;
//課題追加フォームの送信イベント
addTaskDisplay === null || addTaskDisplay === void 0 ? void 0 : addTaskDisplay.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const deadline = document.getElementById("deadline").value;
    const importance = Number(document.getElementById("importance").value);
    const task = {
        id: Date.now(),
        title,
        deadline,
        importance: importance,
        completed: false
    };
    BackDisplay();
    tasks.push(task);
    renderAllTasks();
});
//タスク表示
let editingTaskId = null; //編集中のタスクIDを保持
let tasks = [];
const renderAllTasks = () => {
    if (!displaying || !tasklist || !editTaskDisplay || !completeTaskButton || !endlist)
        return;
    if (!tasklist)
        return;
    if (!endlist)
        return;
    tasklist.innerHTML = "";
    endlist.innerHTML = "";
    tasks.forEach(task => {
        const li = document.createElement("li");
        const editButton = document.createElement("button");
        //編集ボタンのUI・機能作成
        editButton.textContent = "編集";
        editButton.addEventListener("click", () => {
            displaying.style.display = "none";
            editTaskDisplay.style.display = "block";
            document.getElementById("edit-title").value = task.title;
            document.getElementById("edit-deadline").value = task.deadline;
            document.getElementById("edit-importance").value = String(task.importance);
            document.getElementById("complete-task-button").textContent = task.completed ? "未完了に戻す" : "完了";
            editingTaskId = task.id;
        });
        completeTaskButton.textContent = task.completed ? "未完了に戻す" : "完了";
        completeTaskButton.addEventListener("click", () => {
            task.completed = !task.completed;
            renderAllTasks();
        });
        li.textContent = `${task.title} | ${task.deadline} | ${renderTaskImportance(task.importance)} | ${task.completed ? "完了" : "未完了"}`;
        li.appendChild(editButton);
        if ((endlist) && (task.completed)) {
            endlist.appendChild(li);
        }
        else {
            tasklist.appendChild(li);
        }
    });
};
//タスクの重要性表示
const renderTaskImportance = (importance) => {
    switch (importance) {
        case 3:
            return "高";
        case 2:
            return "中";
        case 1:
            return "低";
    }
};
//displayingへの切り替え
function BackDisplay() {
    if ((displaying && addTaskDisplay) && (addTaskDisplay.style.display === "block")) {
        displaying.style.display = "block";
        addTaskDisplay.style.display = "none";
    }
    else if ((displaying && editTaskDisplay) && (editTaskDisplay.style.display === "block")) {
        displaying.style.display = "block";
        editTaskDisplay.style.display = "none";
    }
}
//editTaskButtonのアドイベ
if (editTaskButton && editTaskDisplay && displaying) {
    editTaskDisplay.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("edit-title").value;
        const deadline = document.getElementById("edit-deadline").value;
        const importance = Number(document.getElementById("edit-importance").value);
        const task = tasks.find(t => t.id === editingTaskId);
        if (!task)
            return;
        task.title = title;
        task.deadline = deadline;
        task.importance = importance;
        renderAllTasks();
        BackDisplay();
    });
}
//editCancelButtonのアドイベ
if (editCancelButton) {
    editCancelButton.addEventListener("click", () => {
        BackDisplay();
    });
}
//deleteTaskButtonのアドイベ
if (deleteTaskButton) {
    deleteTaskButton.addEventListener("click", () => {
        if (editingTaskId === null)
            return;
        tasks = tasks.filter(t => t.id !== editingTaskId);
        renderAllTasks();
        BackDisplay();
    });
}
//カレンダー表示
if (calendar) {
    for (let i = 1; i <= 31; i++) {
        const day = document.createElement("div");
        day.classList.add("day");
        day.textContent = String(i);
        calendar.appendChild(day);
    }
}
export {};
