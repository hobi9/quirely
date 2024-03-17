import { SQL, and, eq, inArray, isNull, notInArray } from 'drizzle-orm';
import { db } from '../../db';
import { membersWorkspaces, users, workspaces } from '../../db/schema';
import { WorkspaceCreation, WorkspaceDetail } from './workspace.schema';

export const insertWorkspace = async (workspace: WorkspaceCreation, ownerId: number) => {
  const { name, description } = workspace;

  return db.transaction(async (tx) => {
    const [createdWorkspace] = await tx
      .insert(workspaces)
      .values({ name: name.trim(), description, ownerId })
      .returning();

    await tx.insert(membersWorkspaces).values({
      memberId: ownerId,
      workspaceId: createdWorkspace!.id,
      accepted: true,
    });
    return createdWorkspace!;
  });
};

export const getWorkspacesByMemberId = async (memberId: number, accepted?: true) => {
  let acceptedCondition: SQL<unknown>;

  if (accepted === undefined) {
    acceptedCondition = isNull(membersWorkspaces.accepted);
  } else {
    acceptedCondition = eq(membersWorkspaces.accepted, accepted);
  }

  const result = await db
    .select({ workspaces })
    .from(workspaces)
    .innerJoin(membersWorkspaces, eq(workspaces.id, membersWorkspaces.workspaceId))
    .where(and(eq(membersWorkspaces.memberId, memberId), acceptedCondition));

  return result.map((row) => row.workspaces);
};

export const getWorkspaceDetail = async ({ workspaceId, userId }: { workspaceId: number; userId: number }) => {
  const inQuery = db
    .select({ id: membersWorkspaces.workspaceId })
    .from(membersWorkspaces)
    .where(and(eq(membersWorkspaces.memberId, userId), eq(membersWorkspaces.workspaceId, workspaceId)));

  const [result] = await db
    .select({ workspace: workspaces, owner: users })
    .from(workspaces)
    .innerJoin(users, eq(workspaces.ownerId, users.id))
    .where(inArray(workspaces.id, inQuery));

  if (!result) {
    return null;
  }

  const workspaceDetail: WorkspaceDetail = {
    ...result.workspace,
    owner: result.owner,
  };

  return workspaceDetail;
};

export const findWorkspaceById = async (workspaceId: number) => {
  const result = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));

  return result[0];
};

export const updateWorkspaceLogo = async (logoUrl: string, workspaceId: number) => {
  await db.update(workspaces).set({ logoUrl, updatedAt: new Date() }).where(eq(workspaces.id, workspaceId));
};

export const deleteWorkspaceById = async (workspaceId: number) => {
  await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
};

export const inviteToWorkspace = async ({ workspaceId, userId }: { workspaceId: number; userId: number }) => {
  await db.insert(membersWorkspaces).values({ workspaceId, memberId: userId });
};

export const updateInvitationStatus = async ({
  memberId,
  workspaceId,
  accepted,
}: {
  memberId: number;
  workspaceId: number;
  accepted: boolean;
}) => {
  await db
    .update(membersWorkspaces)
    .set({ accepted })
    .where(and(eq(membersWorkspaces.workspaceId, workspaceId), eq(membersWorkspaces.memberId, memberId)));
};

export const getMembership = async ({ workspaceId, userId }: { workspaceId: number; userId: number }) => {
  const result = await db
    .select()
    .from(membersWorkspaces)
    .where(and(eq(membersWorkspaces.workspaceId, workspaceId), eq(membersWorkspaces.memberId, userId)));

  return result[0];
};

export const getExternalWorkspaceById = async ({ workspaceId, userId }: { workspaceId: number; userId: number }) => {
  const inQuery = db
    .select({ id: membersWorkspaces.memberId })
    .from(membersWorkspaces)
    .where(eq(membersWorkspaces.memberId, userId));

  const [result] = await db
    .select({ workspace: workspaces })
    .from(workspaces)
    .innerJoin(membersWorkspaces, eq(membersWorkspaces.workspaceId, workspaces.id))
    .where(
      and(
        eq(workspaces.id, workspaceId),
        eq(workspaces.ownerId, userId),
        notInArray(membersWorkspaces.memberId, inQuery),
      ),
    );

  if (!result) {
    return null;
  }

  return result.workspace;
};

export const getWorkspaceMembers = async ({ workspaceId, userId }: { workspaceId: number; userId: number }) => {
  const inQuery = db
    .select({ id: membersWorkspaces.workspaceId })
    .from(membersWorkspaces)
    .where(and(eq(membersWorkspaces.workspaceId, workspaceId), eq(membersWorkspaces.memberId, userId)));

  const result = await db
    .select({ user: users })
    .from(users)
    .leftJoin(membersWorkspaces, eq(membersWorkspaces.memberId, users.id))
    .where(and(eq(membersWorkspaces.workspaceId, workspaceId), inArray(membersWorkspaces.workspaceId, inQuery)));

  return result.map((row) => row.user);
};
