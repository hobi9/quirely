export type ServerError<Schema> = {
  statusCode: number;
  error: string;
  message: string;
  field?: keyof Schema;
};
