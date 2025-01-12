import useBoardCreationImages from '@/hooks/useGetBoardCreationImages';
import { cn } from '@/lib/utils';
import { BoardImage } from '@/types/board';
import { Check, Loader2 } from 'lucide-react';

type Props = {
  selectedImage: BoardImage | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<BoardImage | null>>;
  errorMessage?: string;
};

const BoardImagePicker = ({
  selectedImage,
  setSelectedImage,
  errorMessage,
}: Props) => {
  const { data: images, isPending } = useBoardCreationImages();

  if (isPending) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {errorMessage && !selectedImage && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
      <ul className="mb-2 grid grid-cols-3 gap-2">
        {images?.map((image) => (
          <li
            key={image.id}
            className={cn(
              'group relative aspect-video cursor-pointer transition hover:opacity-80',
            )}
          >
            <input
              type="radio"
              id={`image-${image.id}`}
              name="boardImage"
              value={image.id}
              checked={selectedImage?.id === image.id}
              onChange={() => setSelectedImage(image)}
              className="sr-only"
            />
            <label htmlFor={`image-${image.id}`}>
              {selectedImage && selectedImage.id === image.id && (
                <div className="absolute flex size-full items-center justify-center bg-black/30">
                  <Check className="size-4 text-white" />
                </div>
              )}
              <img
                src={image.thumbnailUrl}
                alt={image.description}
                className="size-full rounded-sm object-cover"
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default BoardImagePicker;
