import type { InferSelectModel } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey().notNull(),
    email: varchar('email', { length: 254 }).notNull(),
    fullName: varchar('full_name', { length: 100 }).notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }),
    isVerified: boolean('is_verified').default(false).notNull(),
    avatarUrl: text('avatar_url'),
  },
  (table) => {
    return {
      emailKey: uniqueIndex('users_email_key').on(table.email),
    };
  },
);

export const workspaces = pgTable('workspaces', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  ownerId: integer('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
  logoUrl: text('logo_url'),
});

export const membersWorkspaces = pgTable(
  'members_workspaces',
  {
    memberId: integer('member_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    workspaceId: integer('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    accepted: boolean('accepted'),
  },
  (table) => {
    return {
      membersWorkspacesPkey: primaryKey({
        columns: [table.memberId, table.workspaceId],
        name: 'members_workspaces_pkey',
      }),
    };
  },
);

export type SelectUser = InferSelectModel<typeof users>;
