const addTaskForm = document.getElementById("add-task-form");
const addButton = document.getElementById("add-button");
const displaying = document.getElementById("displaying");
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
});
export {};
