export type TaskCreation = {
  title: string;
  description: string;
};

export type Task = {
  id: number;
} & TaskCreation;
