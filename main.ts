import type { Task } from "./task";

const addTaskDisplay = document.getElementById("add-task-display");
const addButton = document.getElementById("add-button");
const displaying = document.getElementById("displaying");
const tasklist = document.getElementById("task-list");  

if (addButton && addTaskDisplay && displaying) { 
    addButton.addEventListener('click', () => {
        displaying.style.display = "none";
        addTaskDisplay.style.display = "block";
    })
};


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
    console.log(task);
    console.log("①");
    changeDisplay();
    console.log("②");
    renderTask(task);
    console.log("③");
});

const renderTask = (task: Task) => {
    const li = document.createElement("li");
    li.textContent = `${task.title} | ${task.deadline} | ${renderTaskImportance(task.importance)}`;
    tasklist?.appendChild(li);
    console.log("task rendered");
}

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

function changeDisplay() {
    if (displaying && addTaskDisplay) {
        displaying.style.display = "block";
        addTaskDisplay.style.display = "none";
        console.log("display changed");
    }
}