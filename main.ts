import type { Task } from "./task";

const addTaskForm = document.getElementById("add-task-form");
const addButton = document.getElementById("add-button");
const displaying = document.getElementById("displaying");
const tasklist = document.getElementById("task-list");  

if (addButton && addTaskForm && displaying) { 
    addButton.addEventListener('click', () => {
        displaying.style.display = "none";
        addTaskForm.style.display = "block";
    })
};


addTaskForm?.addEventListener('submit', (e) => {
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
    importance: importance as 1 | 2 | 3,
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
    li.textContent = `${task.title} | ${task.deadline} | ${task.importance}`;
    tasklist?.appendChild(li);
    console.log("task rendered");
}

function changeDisplay() {
    if (displaying && addTaskForm) {
        displaying.style.display = "block";
        addTaskForm.style.display = "none";
        console.log("display changed");
    }
}