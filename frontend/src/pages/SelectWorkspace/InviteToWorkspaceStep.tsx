import MultipleSelector, { Option } from '@/components/MultipleSelector';
import { Button } from '@/components/ui/button';
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { getUsers } from '@/services/userService';
import { inviteToWorkspace } from '@/services/workspaceService';
import { Workspace } from '@/types/workspace';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

type Props = {
  showInitialStep: () => void;
  workspace: Workspace;
};

const InviteToWorkspaceStep = ({ showInitialStep, workspace }: Props) => {
  const [selectedMails, setSelectedMails] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const invitationPromises = selectedMails.map((option) =>
      inviteToWorkspace(workspace.id, option.value),
    );

    await Promise.allSettled(invitationPromises);

    setIsLoading(false);
    showInitialStep();
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Invite members</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="pb-4">
            <p className="text-lg">Email addresses</p>
            <p className="text-sm">Enter one or more email addresses.</p>
          </div>
          <MultipleSelector
            onSearch={async (value) => {
              if (value.length < 3) return [];
              const res = await getUsers({ email: value });
              return res.map(({ email }) => {
                return {
                  label: email,
                  value: email,
                };
              });
            }}
            value={selectedMails}
            onChange={setSelectedMails}
            placeholder="trying to search 'a' to get more options..."
            loadingIndicator={
              <p className="text-md py-2 text-center leading-10 text-muted-foreground">
                loading...
              </p>
            }
            emptyIndicator={
              <p className="text-md w-full text-center leading-10 text-muted-foreground">
                no results found.
              </p>
            }
          />
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              variant="ghost"
              className="text-xs uppercase"
              type="button"
              onClick={showInitialStep}
            >
              skip
            </Button>
            <Button
              className="min-w-36 text-xs uppercase"
              disabled={!selectedMails.length || isLoading}
            >
              {!isLoading ? (
                'send invitation'
              ) : (
                <Loader2 size={16} className="animate-spin" />
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </>
  );
};

export default InviteToWorkspaceStep;
