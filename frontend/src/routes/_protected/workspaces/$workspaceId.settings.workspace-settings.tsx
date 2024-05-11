import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/auth';
import useWorkspace, { workspaceQueryOptions } from '@/hooks/useWorkspace';
import { workspacesQueryOption } from '@/hooks/useWorskpaces';
import { deleteWorkspace, leaveWorkspace } from '@/services/workspaceService';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import UpdateWorkspaceStep from './-(components)/UpdateWorkspaceStep';
import defaultWorkspaceLogo from '../../../assets/workspace-default.png';
import Dialog from '@/components/Dialog';

export const Route = createFileRoute(
  '/_protected/workspaces/$workspaceId/settings/workspace-settings',
)({
  component: Page,
});

function Page() {
  const workspace = useWorkspace();
  const currentUser = useCurrentUser()!;
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();
  const [isShowUpdateForm, setIsShowUpdateForm] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const isWorkspaceOwner = workspace.owner.id === currentUser.id;

  const handleDeleteWorkspace = async () => {
    setIsButtonDisabled(true);
    await deleteWorkspace(workspace.id);
    await queryClient.invalidateQueries({
      ...workspacesQueryOption,
      exact: true,
    });
    navigate({ to: '/select-workspace', replace: true });
    setIsButtonDisabled(false);
    setTimeout(() => {
      queryClient.removeQueries(workspaceQueryOptions(workspace.id));
    }, 500);
  };

  const handleLeaveWorkspace = async () => {
    setIsButtonDisabled(true);
    await leaveWorkspace(workspace.id);
    await queryClient.invalidateQueries({
      ...workspacesQueryOption,
      exact: true,
    });
    navigate({ to: '/select-workspace', replace: true });
    setIsButtonDisabled(false);
    setTimeout(() => {
      queryClient.removeQueries(workspaceQueryOptions(workspace.id));
    }, 500);
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div>
          <h2 className="text-3xl font-bold">Settings</h2>
          <p>Manage workspace settings</p>
        </div>
        <div className="mt-7">
          <h3 className="border-b-2 border-gray-100 text-lg font-bold">
            Workspace Profile
          </h3>
          {!isShowUpdateForm && (
            <div className="group mt-1">
              <Button
                variant={'ghost'}
                className="h-auto w-full justify-between"
                onClick={() => setIsShowUpdateForm(true)}
              >
                <div className="flex items-center gap-x-4">
                  <img
                    src={workspace.logoUrl ?? defaultWorkspaceLogo}
                    alt={`Workspace ${workspace.name} logo`}
                    className="size-14 rounded-md object-cover"
                  />
                  <span>{workspace.name}</span>
                </div>
                <ArrowRight
                  size={18}
                  className="hidden text-slate-500 group-hover:block"
                />
              </Button>
            </div>
          )}
          {isShowUpdateForm && (
            <div className="mt-2">
              <UpdateWorkspaceStep
                workspace={workspace}
                showInitialStep={() => setIsShowUpdateForm(false)}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-x-2 border-t-2 border-gray-100">
          {isWorkspaceOwner && (
            <Dialog
              title="Are you absolutely sure?"
              description="This action cannot be undone. This will permanently delete your workspace."
              cancelText="cancel"
              actionText="continue"
              action={handleDeleteWorkspace}
            >
              <Button
                variant={'outline'}
                className="mt-2 border-red-400 text-xs text-red-500 hover:bg-red-100 hover:text-red-500"
                disabled={isButtonDisabled}
              >
                <div className="flex items-center gap-x-2">
                  <X size={16} />
                  DELETE WORKSPACE
                </div>
              </Button>
            </Dialog>
          )}
          <Dialog
            title="Are you absolutely sure?"
            description="This action cannot be undone. You will leave the following workspace."
            cancelText="cancel"
            actionText="continue"
            action={handleLeaveWorkspace}
          >
            <Button
              variant={'outline'}
              className="mt-2 border-red-400 text-xs text-red-500 hover:bg-red-100 hover:text-red-500"
              disabled={isButtonDisabled}
            >
              <div className="flex items-center gap-x-2">
                <X size={16} />
                LEAVE WORKSPACE
              </div>
            </Button>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
