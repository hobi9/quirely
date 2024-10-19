export type ServerError<Schema> = {
  message: string;
  fields?: Record<keyof Schema, string>;
};

export type UploadFileResponse = {
  url: string;
};
