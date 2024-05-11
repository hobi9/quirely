import useWorkspaceMembers, {
  workspaceMemberQueryOptions,
} from '@/hooks/useWorkspacemembers';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/datatable';
import { Member } from '@/types/workspace';
import useWorkspace from '@/hooks/useWorkspace';
import { cn } from '@/lib/utils';
import defaultAvatar from '../../../assets/defaultAvatar.svg';
import { useCurrentUser } from '@/hooks/auth';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';
import { PopoverContent } from '@radix-ui/react-popover';
import { kickFromWorkspace } from '@/services/workspaceService';
import { useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';

export const Route = createFileRoute(
  '/_protected/workspaces/$workspaceId/settings/',
)({
  loader: async ({ params, context: { queryClient } }) => {
    const { workspaceId } = params;
    await queryClient.ensureQueryData(workspaceMemberQueryOptions(workspaceId));
  },
  component: Page,
});

const CellComponent: React.FC<{ row: { original: MemberColumn } }> = ({
  row,
}) => {
  const { fullName, avatarUrl, id } = row.original;
  const currentUser = useCurrentUser()!;
  return (
    <div className="flex items-center gap-x-2 text-xs">
      <img
        src={avatarUrl || defaultAvatar}
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
  const { id } = row.original;
  const workspace = useWorkspace();
  const currentUser = useCurrentUser()!;
  const queryClient = useQueryClient();

  const handleKick = async () => {
    await kickFromWorkspace({ workspaceId: workspace.id, memberId: id });
    await queryClient.invalidateQueries(
      workspaceMemberQueryOptions(workspace.id),
    );
  };

  if (id === currentUser.id) {
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
          Remove Member
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const columns: ColumnDef<MemberColumn>[] = [
  {
    id: 'email',
    header: () => <div className="font-light">User</div>,
    cell: CellComponent,
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

function Page() {
  const workspace = useWorkspace();
  const [memberState, setMemberState] = useState<null | true>(true);
  const filteredMembers: MemberColumn[] = useWorkspaceMembers()
    .filter((member) => member.accepted === memberState)
    .map((member) => ({
      ...member,
      role: workspace.owner.id === member.id ? 'Owner' : 'Member',
    }));

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div>
          <h2 className="text-3xl font-bold">Members</h2>
          <p>View and manage workspace members</p>
        </div>

        <div className="mb-5 border-b">
          <div className="mb-[-1px] flex gap-x-2">
            <button
              className={cn(
                'block border-b px-4 py-2',
                memberState && 'border-b border-black',
              )}
              onClick={() => setMemberState(true)}
            >
              Members
            </button>
            <button
              className={cn(
                'block px-4 py-2',
                !memberState && 'border-b border-black',
              )}
              onClick={() => setMemberState(null)}
            >
              Invitations
            </button>
          </div>
        </div>

        <ScrollArea
          className={cn(
            'h-[420px] rounded-md border-t',
            filteredMembers.length >= 5 && 'border-b',
          )}
        >
          <DataTable data={filteredMembers} columns={columns} />
        </ScrollArea>
      </div>
    </div>
  );
}

type MemberColumn = Member & { role: 'Owner' | 'Member' };
