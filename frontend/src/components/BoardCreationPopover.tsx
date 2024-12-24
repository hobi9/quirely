import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useRef, useState } from 'react';
import BoardImagePicker from './BoardImagePicker';
import { BoardCreation, BoardImage } from '@/types/board';
import { createBoard } from '@/services/boardService';
import useWorkspace from '@/hooks/useWorkspace';
import { useQueryClient } from '@tanstack/react-query';
import { workspaceBoardsQueryOptions } from '@/hooks/useWorkspaceBoards';

type Props = {
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
};

const BoardCreationPopover = ({
  children,
  side = 'bottom',
  align,
  sideOffset = 0,
}: Props) => {
  const [selectedImage, setSelectedImage] = useState<BoardImage | null>(null);
  const [title, setTitle] = useState<string>('');
  const [errors, setErrors] = useState<Partial<BoardCreation>>({});
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { id: workspaceId } = useWorkspace();
  const queryClient = useQueryClient();

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    let isInvalidForm = false;
    if (!selectedImage) {
      setErrors((prev) => ({ ...prev, imageUrl: 'Please select an image.' }));
      isInvalidForm = true;
    }
    if (!title.trim()) {
      setErrors((prev) => ({ ...prev, title: 'Please enter a title.' }));
      isInvalidForm = true;
    }
    if (title.trim().length > 60) {
      setErrors((prev) => ({
        ...prev,
        title: 'Title should not exceed 60 characters.',
      }));
      isInvalidForm = true;
    }
    if (isInvalidForm) {
      return;
    }

    await createBoard({ title, imageUrl: selectedImage!.url }, workspaceId);
    setTitle('');
    setSelectedImage(null);
    closeButtonRef.current?.click();
    await queryClient.invalidateQueries(
      workspaceBoardsQueryOptions(workspaceId),
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className="w-80 pt-3"
      >
        <span className="mb-4 block text-center text-sm font-medium">
          Create Board
        </span>
        <PopoverClose asChild>
          <Button
            variant={'ghost'}
            className="absolute right-2 top-2 h-auto w-auto p-2"
            ref={closeButtonRef}
          >
            <X className="size-4" />
          </Button>
        </PopoverClose>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <BoardImagePicker
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            errorMessage={errors.imageUrl}
          />
          <div className="space-y-1">
            <Label htmlFor="title">Board title</Label>
            <Input
              id="title"
              name="title"
              onChange={(e) => {
                const value = e.target.value;
                setTitle(value);
                if (value.trim()) {
                  delete errors.title;
                }
              }}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default BoardCreationPopover;
