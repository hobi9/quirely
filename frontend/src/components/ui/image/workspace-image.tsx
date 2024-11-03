import { cn } from '@/lib/utils';
import defaultWorkspaceLogo from '../../../assets/workspace-default.png';
import ImageWithDefault from './image-with-default';
import { Workspace } from '@/types/workspace';

type Props = {
  workspace: Workspace;
  className?: string;
};

const WorkspaceImage = ({ workspace, className }: Props) => {
  return (
    <ImageWithDefault
      src={workspace.logoUrl}
      alt={`${workspace.name}'s logo`}
      defaultSrc={defaultWorkspaceLogo}
      className={cn('rounded-md object-cover', className)}
    />
  );
};

export default WorkspaceImage;
