import { useCurrentUser } from '@/hooks/auth';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';
import { PopoverContent } from '@radix-ui/react-popover';
import { kickFromWorkspace } from '@/services/workspaceService';
import { useQueryClient } from '@tanstack/react-query';
import useWorkspace from '@/hooks/useWorkspace';
import { workspaceMemberQueryOptions } from '@/hooks/useWorkspacemembers';
import { Member } from '@/types/workspace';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/datatable';
import { MemberState } from '../$workspaceId.settings.index';
import AvatarImage from '@/components/ui/image/avatar-image';

type MemberRoles = 'Owner' | 'Member' | 'Invitee';
type MemberColumn = Member & { role: MemberRoles };

const UserCell: React.FC<{ row: { original: MemberColumn } }> = ({ row }) => {
  const { fullName, id } = row.original;
  const currentUser = useCurrentUser()!;
  return (
    <div className="flex items-center gap-x-2 text-xs">
      <AvatarImage
        user={row.original}
        className="size-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        {id === currentUser.id && (
          <span className="w-min rounded-sm bg-blue-100 px-1 py-0.5 text-xs text-blue-700">
            You
          </span>
        )}
        <span>{fullName}</span>
      </div>
    </div>
  );
};

const ActionCell: React.FC<{ row: { original: MemberColumn } }> = ({ row }) => {
  const { id, role } = row.original;
  const workspace = useWorkspace();
  const currentUser = useCurrentUser()!;
  const queryClient = useQueryClient();

  const handleKick = async () => {
    await kickFromWorkspace({ workspaceId: workspace.id, memberId: id });
    await queryClient.invalidateQueries(
      workspaceMemberQueryOptions(workspace.id),
    );
  };

  if (id === currentUser.id || workspace.owner.id !== currentUser.id) {
    return;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'ghost'}>
          <Ellipsis />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Button variant={'outline'} onClick={handleKick}>
          {role === 'Member' && 'Remove Member'}
          {role === 'Invitee' && 'Revoke Invite'}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const columns: ColumnDef<MemberColumn>[] = [
  {
    id: 'email',
    header: () => <div className="font-light">User</div>,
    cell: UserCell,
  },
  {
    accessorKey: 'role',
    header: () => <div className="font-light">Role</div>,
  },
  {
    id: 'action',
    cell: ActionCell,
  },
];

const getMemberRole = ({
  ownerId,
  memberId,
  state,
}: {
  ownerId: number;
  memberId: number;
  state: MemberState;
}): MemberRoles => {
  if (state === 'Member') {
    return ownerId === memberId ? 'Owner' : 'Member';
  }
  return 'Invitee';
};

const MembersTable: React.FC<{
  members: Member[];
  ownerId: number;
  state: MemberState;
}> = ({ members, ownerId, state }) => {
  const tableData = members.map(
    (member) =>
      ({
        ...member,
        role: getMemberRole({
          ownerId,
          memberId: member.id,
          state,
        }),
      }) satisfies MemberColumn,
  );
  return <DataTable data={tableData} columns={columns} />;
};
export default MembersTable;
