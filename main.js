const addTaskDisplay = document.getElementById("add-task-display");
const addButton = document.getElementById("add-button");
const displaying = document.getElementById("displaying");
const tasklist = document.getElementById("task-list");
if (addButton && addTaskDisplay && displaying) {
    addButton.addEventListener('click', () => {
        displaying.style.display = "none";
        addTaskDisplay.style.display = "block";
    });
}
;
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
    console.log(task);
    console.log("①");
    changeDisplay();
    console.log("②");
    renderTask(task);
    console.log("③");
});
const renderTask = (task) => {
    const li = document.createElement("li");
    li.textContent = `${task.title} | ${task.deadline} | ${renderTaskImportance(task.importance)}`;
    tasklist === null || tasklist === void 0 ? void 0 : tasklist.appendChild(li);
    console.log("task rendered");
};
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
function changeDisplay() {
    if (displaying && addTaskDisplay) {
        displaying.style.display = "block";
        addTaskDisplay.style.display = "none";
        console.log("display changed");
    }
}
export {};
