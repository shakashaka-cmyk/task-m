export type Task = {
  id: number;
  title: string;
  deadline: string;
  importance: 1 | 2 | 3 | 4 | 5;
  completed: boolean;
};