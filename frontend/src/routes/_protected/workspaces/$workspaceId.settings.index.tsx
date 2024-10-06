import useWorkspaceMembers, {
  workspaceMemberQueryOptions,
} from '@/hooks/useWorkspacemembers';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import useWorkspace from '@/hooks/useWorkspace';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import MembersTable from './-(components)/MembersTable';
import { Button } from '@/components/ui/button';
import InviteToWorkspaceStep from '../select-workspace/-(components)/InviteToWorkspaceStep';
import { UserPlus } from 'lucide-react';

export const Route = createFileRoute(
  '/_protected/workspaces/$workspaceId/settings/',
)({
  loader: async ({ params, context: { queryClient } }) => {
    const { workspaceId } = params;
    await queryClient.ensureQueryData(workspaceMemberQueryOptions(workspaceId));
  },
  component: Page,
});

export type MemberState = 'Member' | 'Invited';

const getMemberFilter = (state: MemberState) => {
  if (state === 'Member') return true;
  return undefined;
};

function Page() {
  const [isShowInvite, setShowInvite] = useState(false);
  const [memberState, setMemberState] = useState<MemberState>('Member');

  const workspace = useWorkspace();
  const filteredMembers = useWorkspaceMembers().filter(
    (member) => member.accepted === getMemberFilter(memberState),
  );

  if (isShowInvite) {
    return (
      <InviteToWorkspaceStep
        showInitialStep={() => setShowInvite(false)}
        workspaceId={workspace.id}
        isNotFromCreationPage
      />
    );
  }

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
                memberState === 'Member' && 'border-b border-black',
              )}
              onClick={() => setMemberState('Member')}
            >
              Members
            </button>
            <button
              className={cn(
                'block border-b px-4 py-2',
                memberState === 'Invited' && 'border-b border-black',
              )}
              onClick={() => setMemberState('Invited')}
            >
              Invitations
            </button>
          </div>
        </div>

        {memberState === 'Invited' && (
          <div className="mb-4 flex justify-between">
            <div>
              <h3 className="font-bold">Individual invitations</h3>
              <p className="text-sm">
                Manually invite members and manage existing invitations.
              </p>
            </div>
            <Button
              className="bg-blue-700 hover:bg-blue-950"
              onClick={() => setShowInvite(true)}
            >
              <div className="flex items-center gap-x-1">
                <UserPlus size={14} />
                <span className="text-xs font-bold">INVITE</span>
              </div>
            </Button>
          </div>
        )}

        <ScrollArea
          className={cn(
            'rounded-md border-t',
            filteredMembers.length >= 5 && 'border-b',
            memberState === 'Member' && 'h-[420px]',
            memberState === 'Invited' && 'h-[350px]',
          )}
        >
          <MembersTable
            ownerId={workspace.owner.id}
            members={filteredMembers}
            state={memberState}
          />
        </ScrollArea>
      </div>
    </div>
  );
}
