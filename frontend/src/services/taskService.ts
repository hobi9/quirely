import { client } from '@/lib/axios';
import { Task, TaskCreation, TaskUpdate } from '@/types/task';

export const createTask = async (listId: number, task: TaskCreation) => {
  const response = await client.post<Task>(`task-lists/${listId}/tasks`, task);

  return response.data;
};

export const reorderTask = async (taskId: number, task: TaskUpdate) => {
  const response = await client.post<Task>(`tasks/${taskId}/reorder`, task);

  return response.data;
};

export const updateTask = async (taskId: number, task: TaskCreation) => {
  const response = await client.patch<Task>(`tasks/${taskId}`, task);

  return response.data;
};
