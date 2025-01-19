import { Board, BoardCreation, BoardImage } from '@/types/board';
import { client } from '../lib/axios';

export const getBoardCreationImages = async () => {
  const response = await client.get<BoardImage[]>('/boards/images');

  return response.data;
};

export const createBoard = async (data: BoardCreation, workspaceId: number) => {
  const response = await client.post<Board>(
    `workspaces/${workspaceId}/boards`,
    data,
  );

  return response.data;
};

export const getBoardsByWorkspace = async (workspaceId: number) => {
  const response = await client.get<Board[]>(
    `workspaces/${workspaceId}/boards`,
  );

  return response.data;
};

export const getBoard = async (boardId: number) => {
  const response = await client.get<Board>(`boards/${boardId}`);

  return response.data;
};

export const deleteBoard = async (boardId: number) => {
  await client.delete<void>(`boards/${boardId}`);
};

export const updateBoard = async (boardId: number, title: string) => {
  const response = await client.patch<Board>(`boards/${boardId}`, {
    title,
  });

  return response.data;
};
