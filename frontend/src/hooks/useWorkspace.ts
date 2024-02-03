import { getWorkspace } from '@/services/workspaceService';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const useWorkspace = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  return useQuery({
    queryKey: ['workspaces', workspaceId],
    queryFn: () => getWorkspace(Number(workspaceId)),
  });
};

export default useWorkspace;
