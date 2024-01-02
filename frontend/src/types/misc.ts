export type ServerError<Schema> = {
  statusCode: number;
  error: string;
  message: string;
  field?: keyof Schema;
};

export type EmailVerificationParams = {
  id: string;
  token: string;
};
