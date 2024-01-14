import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getWorkspaces } from '@/services/workspaceService';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import defaultAvatar from '../../assets/defaultAvatar.svg';
import { ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
  showNextStep: () => void;
};

const SelectWorkspaceStep = ({ showNextStep }: Props) => {
  const { data: workspaces = [] } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  });

  // TODO: add skeleton instead

  return (
    <>
      <CardHeader>
        <CardTitle>Select a Workspace</CardTitle>
        <CardDescription>to continue to Quirely.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <ul role="list" className="max-h-60 space-y-2">
            {workspaces?.map((workspace) => (
              <Button
                key={workspace.id}
                variant={'ghost'}
                asChild
                className="mr-3 block"
              >
                <Link to={`/worskace/${workspace.id}`}>
                  <div className="flex h-full items-center justify-between">
                    <div className="flex items-center  gap-x-2">
                      <img
                        src={workspace.logoUrl || defaultAvatar}
                        className="size-8 rounded-sm  object-cover"
                      />
                      <span className="max-w-72 overflow-hidden text-ellipsis">
                        {workspace.name}
                      </span>
                    </div>
                    <ArrowRight size={18} className="text-slate-700" />
                  </div>
                </Link>
              </Button>
            ))}
          </ul>
        </ScrollArea>
        <div
          className="mt-3 flex w-full items-center text-sm text-slate-400 
            before:w-5 before:flex-grow before:border-t-[0.5px] before:border-slate-400 before:content-['']
            after:w-5 after:flex-grow after:border-t-[0.5px] after:border-slate-400 after:content-['']"
        >
          <span className="px-5">or</span>
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
