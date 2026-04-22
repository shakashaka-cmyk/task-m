const addTaskForm = document.getElementById("add-task-form");
const addButton = document.getElementById("add-button");
const displaying = document.getElementById("displaying");
const tasklist = document.getElementById("task-list");
if (addButton && addTaskForm && displaying) {
    addButton.addEventListener('click', () => {
        displaying.style.display = "none";
        addTaskForm.style.display = "block";
    });
}
;
addTaskForm === null || addTaskForm === void 0 ? void 0 : addTaskForm.addEventListener('submit', (e) => {
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
    console.log(task);
    console.log("①");
    changeDisplay();
    console.log("②");
    renderTask(task);
    console.log("③");
});
const renderTask = (task) => {
    const li = document.createElement("li");
    li.textContent = `${task.title} | ${task.deadline} | ${task.importance}`;
    tasklist === null || tasklist === void 0 ? void 0 : tasklist.appendChild(li);
    console.log("task rendered");
};
function changeDisplay() {
    if (displaying && addTaskForm) {
        displaying.style.display = "block";
        addTaskForm.style.display = "none";
        console.log("display changed");
    }
}
export {};
