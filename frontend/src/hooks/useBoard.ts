import { getBoard } from '@/services/boardService';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

export const boardQueryOptions = (boardId: number) =>
  queryOptions({
    queryKey: ['board', boardId],
    queryFn: () => getBoard(Number(boardId)),
  });

const useBoard = () => {
  const { boardId } = useParams({
    from: '/_protected/boards/$boardId',
  });
  return useSuspenseQuery(boardQueryOptions(Number(boardId))).data;
};

export default useBoard;
