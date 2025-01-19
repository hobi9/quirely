import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { boardQueryOptions } from '@/hooks/useBoard';
import { workspaceBoardsQueryOptions } from '@/hooks/useWorkspaceBoards';
import { updateBoard } from '@/services/boardService';
import { Board } from '@/types/board';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';

const BoardTitleForm: React.FC<{ board: Board }> = ({ board }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputTitle, setInputTitle] = useState(board.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (inputTitle === board.title) {
      setIsEditing(false);
      return;
    }

    const updatedBoard = await updateBoard(board.id, inputTitle);
    await Promise.all([
      queryClient.invalidateQueries(
        workspaceBoardsQueryOptions(board.workspaceId),
      ),
      queryClient.invalidateQueries(boardQueryOptions(board.id)),
    ]);
    setIsEditing(false);
    toast({
      description: (
        <p>
          Board <span className="font-bold">{updatedBoard.title}</span>{' '}
          succesfully updated!
        </p>
      ),
    });
  };

  if (isEditing) {
    return (
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex items-center gap-x-2"
      >
        <Input
          id="title"
          name="title"
          onBlur={() => formRef?.current?.requestSubmit()}
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          ref={inputRef}
          className="h-7 rounded-sm border-none bg-transparent px-[7px] py-1 text-lg font-bold focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      variant={'transparent'}
      className="h-auto w-auto px-2 py-1 text-lg font-bold"
    >
      {board.title}
    </Button>
  );
};
export default BoardTitleForm;
