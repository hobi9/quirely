export type TaskCreation = {
  title: string;
  description?: string;
};

export type Task = {
  id: number;
  order: number;
} & TaskCreation;

export type TaskUpdate = Pick<Task, 'order'> & { taskListId: number };
