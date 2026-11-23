import type { Task } from "../task";
import { deleteTask, updateTask } from "../api";
import TaskForm from "./TaskForm";

type Props = {
  task: Task;
  onChanged: () => void;
  onCancel: () => void;
};

function EditTaskForm({ task, onChanged, onCancel }: Props) {
  const handleToggleComplete = async () => {
    try {
      await updateTask({ ...task, completed: !task.completed });
      onChanged();
    } catch (error) {
      console.error(error);
      alert("更新に失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`「${task.title}」を削除してもよろしいですか？`)) return;

    try {
      await deleteTask(task.id);
      onChanged();
    } catch (error) {
      console.error(error);
      alert("削除に失敗しました");
    }
  };

  return (
    <div id="edit-task-display">
      <div id="edit-task-text">
        <p className="assignment-p">|課題名</p>
        <p className="deadline-p">|締め切り</p>
        <p className="importance-p">|優先度</p>
      </div>
      <TaskForm
        initialValues={task}
        submitLabel="編集を確定"
        onSubmit={async (values) => {
          await updateTask({ ...task, ...values });
          onChanged();
        }}
        onCancel={onCancel}
      >
        <button type="button" onClick={handleDelete}>
          削除
        </button>
        <button type="button" onClick={handleToggleComplete}>
          {task.completed ? "未完了に戻す" : "完了"}
        </button>
      </TaskForm>
    </div>
  );
}

export default EditTaskForm;