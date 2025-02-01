import { getListsByBoardId } from '@/services/listService';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

export const boardListsQueryOptions = (boardId: number) =>
  queryOptions({
    queryKey: ['boards', boardId, 'lists'],
    queryFn: () => getListsByBoardId(boardId),
  });

const useBoardLists = () => {
  const { boardId } = useParams({
    from: '/_protected/boards/$boardId',
  });
  return useSuspenseQuery(boardListsQueryOptions(Number(boardId))).data;
};

export default useBoardLists;
