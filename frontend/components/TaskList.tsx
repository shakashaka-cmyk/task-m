import type { Task } from "../task";
import { renderTaskImportance } from "../utils";

type Props = {
    id: string
    tasks: Task[]
}

function TaskList ({ id, tasks }: Props) {
    return (
        <ul id={id}>
            {tasks.map((task) => (
                <li key={task.id}> 
                    {task.title} {task.deadline} {renderTaskImportance(task.importance)}
                </li>))}
        </ul>
    )
}

export default TaskList