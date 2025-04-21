import { User } from './user';

export type ServerError<Schema> = {
  message: string;
  fields?: Record<keyof Schema, string>;
};

export type UploadFileResponse = {
  url: string;
};

export type Activity = {
  id: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'BOARD' | 'LIST' | 'TASK';
  user: User;
  entityTitle: string;
  createdAt: number;
};
