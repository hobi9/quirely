import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  updateWorkspace,
  updateWorkspaceLogo,
} from '@/services/workspaceService';
import { Workspace, WorkspaceCreation } from '@/types/workspace';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Upload, Loader2 } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { workspaceQueryOptions } from '@/hooks/useWorkspace';
import { workspacesQueryOption } from '@/hooks/useWorskpaces';

type Props = {
  showInitialStep: () => void;
  workspace: Workspace;
};

const createWorkspaceSchema: z.ZodType<WorkspaceCreation> = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional(),
});

async function convertToBlob(url: string): Promise<File | null> {
  try {
    // Fetch the image file from the URL
    const response = await fetch(url);
    const blob = await response.blob();

    // Create a File object from the blob
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    return new File([blob], fileName, { type: blob.type });
  } catch (error) {
    console.error('Error converting URL to File:', error);
    return null;
  }
}

const UpdateWorkspaceStep = ({ showInitialStep, workspace }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<WorkspaceCreation>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: workspace.name,
      description: workspace.description,
    },
  });
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>();
  const [isFileDirty, setIsFileDirty] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxSizeInBytes = 1_000_000;

  const submitForm: SubmitHandler<WorkspaceCreation> = async (data) => {
    const workspaceData = isDirty
      ? await updateWorkspace(data, workspace.id)
      : workspace;
    if (file) {
      try {
        await updateWorkspaceLogo(workspaceData.id, file);
      } catch (error) {
        console.log('error'); // TODO: handle it better later
      }
    }
    await Promise.all([
      queryClient.invalidateQueries(workspaceQueryOptions(workspace.id)),
      queryClient.invalidateQueries(workspacesQueryOption),
    ]);
    showInitialStep();
  };

  const handleButtonClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.size > maxSizeInBytes) {
      alert('Selected file exceeds the maximum size of 1 MB.'); // TODO: add toaster instead
      return;
    }

    setFile(selectedFile);
    setIsFileDirty(true);
  };

  const handleFileReset = () => {
    if (!inputRef.current) return;
    inputRef.current.value = '';
    setFile(null);
    setIsFileDirty(true);
  };

  useEffect(() => {
    if (workspace.logoUrl) {
      convertToBlob(workspace.logoUrl).then((res) => setFile(res));
    }
  }, [workspace.logoUrl]);

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-x-4">
            <Input
              id="logo"
              accept=".jpg, .jpeg, .png"
              type="file"
              className="hidden"
              ref={inputRef}
              onChange={handleFileChange}
              name="logo"
            />
            <div className="flex size-14 items-center justify-center overflow-hidden rounded-md">
              {!file ? (
                <Button
                  type="button"
                  variant={'ghost'}
                  className="group size-full"
                  onClick={handleButtonClick}
                >
                  <Upload
                    size={20}
                    className="transition group-hover:scale-125"
                  />
                </Button>
              ) : (
                <img
                  src={URL.createObjectURL(file)}
                  className="size-full object-cover"
                />
              )}
            </div>
            <div className="flex h-full flex-col justify-between">
              <span className="text-md">Workspace image</span>
              {file && (
                <button
                  type="button"
                  className="w-fit text-sm text-red-500 hover:underline"
                  onClick={handleFileReset}
                >
                  Update image
                </button>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Workspace name</Label>
            <Input
              id="name"
              aria-invalid={!!errors.name}
              {...register('name')}
              className={clsx(
                errors.name && 'ring ring-red-200 focus-visible:ring-red-200',
              )}
            />
            <p className="text-xs text-red-500">{errors.name?.message}</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Workspace description</Label>
            <Textarea
              id="description"
              aria-invalid={!!errors.description}
              {...register('description')}
              className="resize-none"
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="grid w-full grid-cols-1 items-center justify-end gap-2 sm:flex">
            <Button
              variant="outline"
              className="text-xs uppercase"
              onClick={showInitialStep}
              disabled={isSubmitting}
              type="button"
            >
              cancel
            </Button>
            <Button
              className="min-w-40 text-xs uppercase"
              disabled={isSubmitting || (!isDirty && !isFileDirty)}
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                'update workspace'
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </>
  );
};

export default UpdateWorkspaceStep;
