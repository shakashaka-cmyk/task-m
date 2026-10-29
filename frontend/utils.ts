import type { Task } from "./task";

//残り日数取得
export function getRemainingDays(deadline: string): number {
    const today = new Date()
    const dueDate = new Date(deadline)

    const diff = 
    dueDate.getTime() - today.getTime()

    return Math.ceil(
        diff / (1000 * 60 * 60 * 24)
    )
}

export function calculateUrgency(task: Task): number {

    const remainingDays =
    getRemainingDays(task.deadline);

    if  (remainingDays <= 0) {
        return task.importance * 10
    } else {
        return task.importance / remainingDays;
    }
}

export function getUrgencyClass(task: Task): string {

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

export function renderTaskImportance (importance: 3 | 2 | 1): string {
    switch (importance) {
        case 3:
            return "高";
        case 2:
            return "中";
        case 1:
            return "低";
    }
}

export function generateDates(start: Date, end: Date, days: number[]): string[] {
    const dates: string[] = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
        if (days.includes(currentDate.getDay())) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const date = String(currentDate.getDate()).padStart(2, "0");
            dates.push(`${year}-${month}-${date}`);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}