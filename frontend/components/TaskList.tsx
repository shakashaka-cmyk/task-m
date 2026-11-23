import type { Task } from "../task";
import { renderTaskImportance } from "../utils";

type Props = {
    id: string
    tasks: Task[]
    onEdit: (task: Task) => void;
}

function TaskList ({ id, tasks, onEdit }: Props) {
    return (
        <ul id={id}>
            {tasks.map((task) => (
                <li key={task.id}> 
                    {task.title} {task.deadline} {renderTaskImportance(task.importance)}
                    <button type="button" onClick={() => onEdit(task)}>   {/* ③ ボタンを追加 */}
                    編集
                    </button>
                </li>))}
        </ul>
    )
}

export default TaskList