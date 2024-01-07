import { Button } from '@/components/ui/button';
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

type Props = {
  showInitialStep: () => void;
};

const InviteToWorkspaceStep = ({ showInitialStep }: Props) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Invite Workspace</CardTitle>
        <CardDescription>to continue to Quirely.</CardDescription>
      </CardHeader>
      <CardContent>
        <div>Profile image</div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-end gap-2">
          <Button
            variant="outline"
            className="text-xs uppercase"
            onClick={showInitialStep}
          >
            cancel
          </Button>
          <Button className="text-xs uppercase" onClick={showInitialStep}>
            send invitation
          </Button>
        </div>
      </CardFooter>
    </>
  );
};

export default InviteToWorkspaceStep;
