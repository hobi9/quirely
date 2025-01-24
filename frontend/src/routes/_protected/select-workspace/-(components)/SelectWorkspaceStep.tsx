import WorkspaceSelectList from '@/components/WorkspaceSelectList';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Props = {
  showNextStep: () => void;
};

const SelectWorkspaceStep = ({ showNextStep }: Props) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Select a Workspace</CardTitle>
        <CardDescription>to continue to Quirely.</CardDescription>
      </CardHeader>
      <CardContent>
        <WorkspaceSelectList />
        <div
          className="mt-3 flex w-full items-center text-sm text-slate-400 
            before:w-5 before:grow before:border-t-[0.5px] before:border-slate-400 before:content-['']
            after:w-5 after:grow after:border-t-[0.5px] after:border-slate-400 after:content-['']"
        >
          <span className="px-5 text-slate-600">or</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full text-xs uppercase"
          onClick={showNextStep}
        >
          create workspace
        </Button>
      </CardFooter>
    </>
  );
};

export default SelectWorkspaceStep;
