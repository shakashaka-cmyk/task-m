import { createTask } from "../api";
import TaskForm from "./TaskForm";

type Props = {
  onAdded: () => void;
  onCancel: () => void;
};

function AddTaskForm({ onAdded, onCancel }: Props) {
  return (
    <div id="add-task-display">
      <div id="add-task-text">
        <p className="assignment-p">|課題名</p>
        <p className="deadline-p">|締め切り</p>
        <p className="importance-p">|優先度</p>
      </div>
      <TaskForm
        submitLabel="追加"
        onSubmit={async (values) => {
          await createTask({ ...values, completed: false });
          onAdded();
        }}
        onCancel={onCancel}
      />
    </div>
  );
}

export default AddTaskForm;