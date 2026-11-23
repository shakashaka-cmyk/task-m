import { useState } from "react";
import type { ReactNode, SubmitEvent } from "react";

export type TaskFormValues = {
  title: string;
  deadline: string;
  importance: 3 | 2 | 1;
};

type Props = {
  initialValues?: TaskFormValues;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
  children?: ReactNode;
};

const emptyValues: TaskFormValues = { title: "", deadline: "", importance: 3 };

function TaskForm({ initialValues = emptyValues, submitLabel, onSubmit, onCancel, children }: Props) {
  const [title, setTitle] = useState(initialValues.title);
  const [deadline, setDeadline] = useState(initialValues.deadline);
  const [importance, setImportance] = useState(initialValues.importance);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !deadline) {
      alert("課題名と締め切りを入力してください");
      return;
    }
    try {
      await onSubmit({ title, deadline, importance });
    } catch (error) {
      console.error(error);
      alert("保存に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit}>

        <input
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      
      <select
        value={importance}
        onChange={(e) => setImportance(Number(e.target.value) as 3 | 2 | 1)}
      >
        <option value="3">高</option>
        <option value="2">中</option>
        <option value="1">低</option>
      </select>
      
      <button type="submit">{submitLabel}</button>
      <button type="button" onClick={onCancel}>キャンセル</button>
      {children}
    </form>
  );
}

export default TaskForm;