import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const genSalt = (rounds?: number) => bcrypt.genSalt(rounds);

export const compareHash = (s1: string, s2: string) => bcrypt.compare(s1, s2);

export const hash = (toHash: string, salt: string) => bcrypt.hash(toHash, salt);

export const createToken = (opts: {
  payload: string | object | Buffer;
  secret: string;
  duration?: string | number;
}) => {
  const { payload, secret, duration } = opts;
  return jwt.sign(payload, secret, { expiresIn: duration });
};

export const verifyToken = <T extends string | object | Buffer>(opts: { token: string; secret: string }) => {
  const { token, secret } = opts;

  return jwt.verify(token, secret) as T;
};
