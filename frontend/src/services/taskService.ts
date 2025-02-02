import { client } from '@/lib/axios';
import { Task, TaskCreation } from '@/types/task';

export const createTask = async (listId: number, task: TaskCreation) => {
  const response = await client.post<Task>(`task-lists/${listId}/tasks`, task);

  return response.data;
};
