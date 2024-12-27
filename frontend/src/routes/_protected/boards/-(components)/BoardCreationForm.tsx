import { useState } from 'react';
import { BoardCreation, BoardImage } from '@/types/board';
import { createBoard } from '@/services/boardService';
import { useQueryClient } from '@tanstack/react-query';
import { workspaceBoardsQueryOptions } from '@/hooks/useWorkspaceBoards';
import BoardImagePicker from '@/components/BoardImagePicker';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import useWorkspaces from '@/hooks/useWorskpaces';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  closeButtonRef: React.RefObject<HTMLButtonElement>;
};

const BoardCreationForm = ({ closeButtonRef }: Props) => {
  const workspaces = useWorkspaces();
  const [selectedImage, setSelectedImage] = useState<BoardImage | null>(null);
  const [title, setTitle] = useState<string>('');
  const [errors, setErrors] = useState<Partial<BoardCreation>>({});
  const [workspaceId, setWorkspaceId] = useState<number>(workspaces[0]!.id);
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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <BoardImagePicker
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        errorMessage={errors.imageUrl}
      />
      <div className="space-y-1">
        <div>
          <Label htmlFor="title">Board title</Label>
          <Input
            id="title"
            name="title"
            onChange={(e) => {
              const value = e.target.value;
              setTitle(value);
              if (value.trim()) {
                setErrors((prev) => ({ ...prev, title: '' }));
              }
            }}
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title}</p>
          )}
        </div>
        {workspaces.length > 1 && (
          <div>
            <Label htmlFor="title">Workspace</Label>
            <Select
              onValueChange={(value) => setWorkspaceId(Number(value))}
              defaultValue={String(workspaceId)}
            >
              <SelectTrigger>
                <SelectValue placeholder="0" />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={String(workspace.id)}>
                    {workspace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <Button type="submit" className="w-full">
        Create
      </Button>
    </form>
  );
};

export default BoardCreationForm;
