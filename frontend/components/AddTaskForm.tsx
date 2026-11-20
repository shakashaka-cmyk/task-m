import { useState } from "react"
import type { SubmitEvent } from "react" 
import { createTask } from "../api"

type Props = {
    onCancel: () => void
    onAdded: () => void
}

function AddTaskForm ({ onAdded, onCancel }: Props) {

const [title, setTitle] = useState("");
const [deadline, setDeadline] = useState("");
const [importance, setImportance] = useState<3 | 2 | 1>(3);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();                                          // ①

        if (!title || !deadline) {                                   // ②
            alert("課題名と締め切りを入力してください");
            return;
        }

        try {
            await createTask({                                       // ③④
                title,
                deadline,
                importance,
                completed: false,
            });
            onAdded();                                               // ⑤
        } catch (error) {
            console.error(error);                                    // ⑥
            alert("追加に失敗しました");
        }
    };

    return (
    <div id="add-task-display">
        <div id="add-task-text">
            <p className="assignment-p">|課題名</p>
            <p className="deadline-p">|締め切り</p>
            <p className="importance-p">|優先度</p>
        </div>
        <form id="add-task-form" onSubmit={handleSubmit}>

            <input type="text" id="title" placeholder="タイトル"
                value={title}
                onChange={(e) => setTitle(e.target.value)}/>

            <input type="date" id="deadline" placeholder="締め切り"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                />

            <select id="importance"
                value={importance}
                onChange={ (e) => setImportance(Number(e.target.value) as 3|2|1)}
                >
                <option value="3">高</option>
                <option value="2">中</option>
                <option value="1">低</option>
            </select>
            <button type="submit" id="add-task-button">追加</button>
            <button type="button" id="add-cancel-button" onClick={onCancel}>キャンセル</button>
        </form>
    </div>
    )
}

export default AddTaskForm;