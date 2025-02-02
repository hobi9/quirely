import { Task } from './task';

export type List = {
  id: number;
  order: number;
  tasks: Task[];
} & ListCreation;

export type ListCreation = {
  title: string;
};
