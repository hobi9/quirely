import { getBoardCreationImages } from '@/services/boardService';
import { useQuery } from '@tanstack/react-query';

const useBoardCreationImages = () => {
  return useQuery({
    queryKey: ['board-creation-images'],
    queryFn: getBoardCreationImages,
    staleTime: 3_600_000,
  });
};

export default useBoardCreationImages;
