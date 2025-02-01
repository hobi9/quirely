import { client } from '@/lib/axios';
import { List, ListCreation } from '@/types/list';

export const getListsByBoardId = async (boardId: number) => {
  const response = await client.get<List[]>(`boards/${boardId}/task-lists`);

  return response.data;
};

export const createList = async (boardId: number, list: ListCreation) => {
  const response = await client.post<List>(
    `boards/${boardId}/task-lists`,
    list,
  );

  return response.data;
};

export const updateList = async (listId: number, list: List) => {
  const response = await client.put<List>(`task-lists/${listId}`, list);

  return response.data;
};

export const deleteList = async (listId: number) => {
  await client.delete<void>(`task-lists/${listId}`);
};

export const cloneList = async (listId: number) => {
  const response = await client.post<List>(`task-lists/${listId}/duplicate`);

  return response.data;
};
