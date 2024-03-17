import { FastifyReply, FastifyRequest } from 'fastify';
import { UserLogin, UserRegistration } from './auth.schema';
import crypto from 'crypto';
import { logger } from '../../lib/logger';
import { compareHash, createToken, genSalt, hash, verifyToken } from './auth.service';
import { sendMail } from '../../lib/mailer';
import { createUser, findUserByEmail, findUserById, updateVerification } from '../users/user.service';

export const registerUser = async (request: FastifyRequest<{ Body: UserRegistration }>, reply: FastifyReply) => {
  const { CLIENT_BASE_URL, JWT_EMAIL_SECRET } = process.env;
  const { email, fullName, password } = request.body;

  const lowerCasedEmail = email.toLowerCase();

  const userInDb = await findUserByEmail(lowerCasedEmail);

  if (userInDb) {
    return reply.sendValidationError<UserRegistration>(409, {
      message: 'User with the given email already exists.',
      field: 'email',
    });
  }

  const salt = await genSalt(10);
  const passwordHash = await hash(password, salt);

  const createdUser = await createUser({
    fullName: fullName.trim(),
    password: passwordHash,
    email: lowerCasedEmail,
  });

  const confirmationToken = createToken({
    payload: { id: createdUser.id },
    secret: JWT_EMAIL_SECRET,
    duration: 60 * 60 * 24,
  });

  await sendMail({
    receiverEmail: lowerCasedEmail,
    subject: 'Quirely - Verify email',
    html: `<!doctype html>
      <html>
        <body>
          <p>Verify your email <a href="${CLIENT_BASE_URL}/verify-email/${confirmationToken}">here</a></p>
        </body>
      </html>
      `,
  });

  return reply.code(201).send();
};

export const verifyEmail = async (request: FastifyRequest<{ Params: { token: string } }>, reply: FastifyReply) => {
  try {
    const { token } = request.params;
    const { id } = verifyToken<{ id: number }>({ token, secret: process.env.JWT_EMAIL_SECRET });

    await updateVerification(id);

    return reply.code(204).send();
  } catch (err) {
    logger.error(err, 'Error during verifyEmail');
    return reply.sendError(400, 'Invalid token');
  }
};

export const login = async (request: FastifyRequest<{ Body: UserLogin }>, reply: FastifyReply) => {
  const { email, password } = request.body;

  const user = await findUserByEmail(email.toLowerCase());

  if (!user) {
    // instead of returning early we compare with a random string in order to prevent timing attacks
    const randomString = crypto.randomBytes(24).toString('hex');
    await compareHash(password, randomString);
    return reply.sendValidationError<UserLogin>(400, { message: 'Invalid email or password.', field: 'email' });
  }

  const isValidPassword = await compareHash(password, user.password);

  if (!isValidPassword) {
    return reply.sendValidationError<UserLogin>(400, { message: 'Invalid email or password.', field: 'email' });
  }

  if (!request.session.userId) {
    request.session.userId = user.id;
    await request.session.regenerate();
    request.session.userId = user.id;
  }

  return reply.code(204).send();
};

export const signout = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.session.destroy();

  return reply.code(204).send();
};

export const csrfRefresh = async (_request: FastifyRequest, reply: FastifyReply) => {
  const csrfToken = reply.generateCsrf();
  return { csrfToken };
};

export const getMe = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.session.userId;

  if (!userId) {
    return reply.code(204).send(null);
  }

  const user = await findUserById(userId);

  if (!user) {
    return reply.code(204).send(null);
  }

  return user;
};
