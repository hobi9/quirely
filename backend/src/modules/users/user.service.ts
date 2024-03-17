import { and, eq, like, ne, notInArray } from 'drizzle-orm';
import { db } from '../../db';
import { membersWorkspaces, users } from '../../db/schema';
import type { UserRegistration } from '../auth/auth.schema';
import type { QueryUser } from './user.schema';

export const findUserById = async (id: number) => {
  const result = await db.select().from(users).where(eq(users.id, id));

  return result[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await db.select().from(users).where(eq(users.email, email));

  return result[0];
};

export const createUser = async (user: UserRegistration) => {
  const newUser = await db
    .insert(users)
    .values({ ...user })
    .returning();

  return newUser[0]!;
};

export const updateVerification = async (id: number) => {
  await db.update(users).set({ isVerified: true }).where(eq(users.id, id));
};

export const findOtherUsersByFilter = async (filter: QueryUser & { userId: number }) => {
  let { email, workspaceId } = filter;

  email = email ? email.toLowerCase() : '';
  workspaceId = workspaceId ?? -1;

  const notInQuery = db
    .select({ id: users.id })
    .from(users)
    .innerJoin(membersWorkspaces, eq(users.id, membersWorkspaces.memberId))
    .where(eq(membersWorkspaces.workspaceId, workspaceId));

  return await db
    .select()
    .from(users)
    .where(and(ne(users.id, filter.userId), like(users.email, `%${email}%`), notInArray(users.id, notInQuery)));
};

export const updateUserAvatar = async (avatarUrl: string, userId: number) => {
  await db.update(users).set({ avatarUrl, updatedAt: new Date() }).where(eq(users.id, userId));
};
