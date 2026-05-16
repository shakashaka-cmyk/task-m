import type { Task } from "./task";
import * as holiday_jp from "@holiday-jp/holiday_jp";

const addTaskDisplay = document.getElementById("add-task-display");
const addButton = document.getElementById("add-button");
const displaying = document.getElementById("displaying");
const taskList = document.getElementById("task-list");  
const endList = document.getElementById("end-list");
const addTaskForm = document.getElementById("add-task-form") as HTMLFormElement;
const editTaskDisplay = document.getElementById("edit-task-display");
const editTaskButton = document.getElementById("edit-task-button");
const editCancelButton = document.getElementById("edit-cancel-button");
const deleteTaskButton = document.getElementById("delete-task-button");
const completeTaskButton = document.getElementById("complete-task-button");
const calendar = document.getElementById("calendar")
const calendarDisplay = document.getElementById("calendar-display")
const nextMonthButton = document.getElementById("next-month")
const prevMonthButton = document.getElementById("prev-month")
const dateDisplay = document.getElementById("date")
const container =document.getElementById("top-priority-list");

//課題追加フォームへの遷移
if (addButton && addTaskDisplay && displaying && calendarDisplay) { 
    addButton.addEventListener('click', () => {
        displaying.style.display = "none";
        calendarDisplay.style.display = "none"
        addTaskDisplay.style.display = "block";

        addTaskForm.reset();
    })
};

//課題追加フォームの送信イベント
addTaskDisplay?.addEventListener('submit', async (e) => {
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
    await saveTasks()
    renderAllTasks();
    renderCalendar(currentYear, currentMonth);
    renderTopPriorityTasks()
});

//タスク表示
let editingTaskId: number | null = null; //編集中のタスクIDを保持
let tasks: Task[] = [];

const renderAllTasks = () => {
    if (!displaying || !taskList || !editTaskDisplay || !completeTaskButton ||!endList ||!calendarDisplay) return;

    if (!taskList) return;
    if (!endList) return;

    taskList.innerHTML = "";
    endList.innerHTML ="";
    tasks.forEach(task=>{
        const li = document.createElement("li");
        const editButton = document.createElement("button");
        //編集ボタンのUI・機能作成
        editButton.textContent = "編集";
        editButton.addEventListener("click", () => {
        displaying.style.display = "none";
        calendarDisplay.style.display = "none"
        editTaskDisplay.style.display = "block";

            (document.getElementById("edit-title") as HTMLInputElement).value = task.title;
            (document.getElementById("edit-deadline") as HTMLInputElement).value = task.deadline;
            (document.getElementById("edit-importance") as HTMLSelectElement).value = String(task.importance);
            (document.getElementById("complete-task-button") as HTMLButtonElement).textContent = task.completed ? "未完了に戻す" : "完了";
            editingTaskId = task.id;
        });
        completeTaskButton.textContent = task.completed ? "未完了に戻す" : "完了";
        completeTaskButton.addEventListener("click", async () => {
            task.completed = !task.completed;
            await saveTasks()
            renderAllTasks();
            renderCalendar(currentYear, currentMonth);
        })
        li.textContent = `${task.title} | ${task.deadline} | ${renderTaskImportance(task.importance)} | ${task.completed ? "完了" : "未完了"}`;
        li.appendChild(editButton);
        if ((endList) && (task.completed)) {
            endList.appendChild(li);
        } else {
            taskList.appendChild(li);
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
    if ((displaying && addTaskDisplay && calendarDisplay) && (addTaskDisplay.style.display === "block")) {
        displaying.style.display = "block";
        calendarDisplay.style.display = "block"
        addTaskDisplay.style.display = "none";
    } else if ((displaying && editTaskDisplay && calendarDisplay) && (editTaskDisplay.style.display === "block")) {
        displaying.style.display = "block";
        calendarDisplay.style.display = "block"
        editTaskDisplay.style.display = "none";
    }
}

//editTaskButtonのアドイベ
if (editTaskButton && editTaskDisplay && displaying) {      
editTaskDisplay.addEventListener("submit", async (e) => {
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

    await saveTasks()
    renderAllTasks();
    BackDisplay();
    renderTopPriorityTasks()
})}

//editCancelButtonのアドイベ
if (editCancelButton) {
    editCancelButton.addEventListener("click", () => {
        BackDisplay();
        renderCalendar(currentYear, currentMonth)
    })
}

//deleteTaskButtonのアドイベ
if (deleteTaskButton) {
    deleteTaskButton.addEventListener("click", () => {
        if (editingTaskId === null) return;
        tasks = tasks.filter(t => t.id !== editingTaskId);
        saveTasks()
        renderAllTasks();
        renderCalendar(currentYear, currentMonth)
        BackDisplay();
        renderTopPriorityTasks()
    })
}

//カレンダー表示
let currentYear = 2026
let currentMonth = 5



//カレンダー表示関数
function renderCalendar(currentYear :number, currentMonth :number) {
    if (calendar && dateDisplay) {
        calendar.innerHTML =  ""
        const firstDay =
        new Date(currentYear, currentMonth, 1).getDay()
        const lastDate =
        new Date(currentYear, currentMonth + 1, 0).getDate();
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement("div");
            calendar.appendChild(empty);
        }
        for (let day = 1; day <= lastDate; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            const date = new Date(currentYear, currentMonth, day);
            const dayOfWeek = date.getDay();
            const month =
            String(currentMonth + 1).padStart(2, "0");

            const dateString =
            String(day).padStart(2, "0");

            const fullDate =
            `${currentYear}-${month}-${dateString}`;
                dayElement.dataset.date = fullDate;

            if (dayOfWeek === 0) {
                dayElement.classList.add("sun");
            }

            if (dayOfWeek === 6) {
                dayElement.classList.add("sat");
            }

            if (holiday_jp.isHoliday(date)) {
                dayElement.classList.add("holiday");
            }

            const dayNumber = document.createElement("div");
            dayNumber.textContent = String(day);

            dayElement.appendChild(dayNumber)
            calendar.appendChild(dayElement);
            
            const dayTasks =
            tasks.filter(task => task.deadline === fullDate
                &&!task.completed
            );
            
            dayTasks.forEach(task => {

            const taskElement =
            document.createElement("div");

            taskElement.textContent = task.title;

            taskElement.classList.add("calendar-task");

            taskElement.classList.add(
                getUrgencyClass(task)
            );

            if (task.importance === 3) {
                taskElement.classList.add("high");
            }

            if (task.importance === 2) {
                taskElement.classList.add("middle");
            }

            if (task.importance === 1) {
                taskElement.classList.add("low");
            }

            taskElement.addEventListener("click", () => {
                displaying!.style.display = "none";
                calendarDisplay!.style.display = "none";
                editTaskDisplay!.style.display = "block";

                (document.getElementById("edit-title") as HTMLInputElement).value = task.title;

                (document.getElementById("edit-deadline") as HTMLInputElement).value = task.deadline;

                (document.getElementById("edit-importance") as HTMLSelectElement).value =
                String(task.importance);

                 completeTaskButton!.textContent =
                task.completed ? "未完了に戻す" : "完了";

                editingTaskId = task.id;

            })

            dayElement.appendChild(taskElement);
            });
        }
        dateDisplay.textContent = currentYear + "年" + (currentMonth+1) + "月"
    }
}

//月表示切り替え
nextMonthButton?.addEventListener("click", () => {
      currentMonth++;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    renderCalendar(currentYear, currentMonth);
})

prevMonthButton?.addEventListener("click", () => {
      currentMonth--;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    renderCalendar(currentYear, currentMonth);
})

//残り日数取得
function getRemainingDays(deadline: string): number {
    const today = new Date()
    const dueDate = new Date(deadline)

    const diff = 
    dueDate.getTime() - today.getTime()

    return Math.ceil(
        diff / (1000 * 60 * 60 * 24)
    )
}

//緊急度測定
function calculateUrgency(task: Task): number {

    const remainingDays =
    getRemainingDays(task.deadline);

    return task.importance / remainingDays;
}

//最重要課題表示
function renderTopPriorityTasks() {
 if (!container) return;

    container.innerHTML = "";

    const topTasks =
    tasks
    .filter(task => !task.completed)
    .sort((a, b) =>
        calculateUrgency(b)
        - calculateUrgency(a)
    )
    .slice(0, 3);

    topTasks.forEach(task => {

        const div =
        document.createElement("div");

        div.textContent =
        `${task.title} ${task.deadline} ${renderTaskImportance(task.importance)}`;

        div.classList.add("top-priority-task")
        div.classList.add(getUrgencyClass(task))

        container.appendChild(div);
    });
}

//緊急度別にクラス付与
function getUrgencyClass(task: Task): string {

    const urgency =
    calculateUrgency(task);

    if (urgency >= 3) {
        return "urgency-max"
    } else if (urgency > 1) {
        return "urgency-high";
    } else if (urgency >= 0.5) {
        return "urgency-middle";
    } else {
    return "urgency-low";
    }
}

async function saveTasks() {

    await fetch(
      "/tasks",
        {
            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify(tasks)
        }
    );
}

async function loadTasks() {

    const response =
    await fetch(
        "/tasks"
    );

    tasks = await response.json();

    renderAllTasks();

    renderCalendar(
        currentYear,
        currentMonth
    );

    renderTopPriorityTasks();
}

async function init() {
    await loadTasks();
}

init();