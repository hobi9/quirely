import { getBoardsByWorkspace } from '@/services/boardService';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

export const workspaceBoardsQueryOptions = (workspaceId: number) =>
  queryOptions({
    queryKey: ['workspaces', workspaceId, 'boards'],
    queryFn: () => getBoardsByWorkspace(workspaceId),
  });

const useWorkspaceBoards = () => {
  const { workspaceId } = useParams({
    from: '/_protected/workspaces/$workspaceId',
  });
  return useSuspenseQuery(workspaceBoardsQueryOptions(Number(workspaceId)))
    .data;
};

export default useWorkspaceBoards;
