import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authQueryOptions, useCurrentUser } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { UpdateUser } from '@/types/user';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';
import defaultAvatar from '../../assets/defaultAvatar.svg';
import { z } from 'zod';
import { FILE_MAX_SIZE_BYTES } from '@/utils/constants';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateAvatar, updateUser } from '@/services/userService';
import { queryClient } from '@/lib/queryClient';

export const Route = createFileRoute('/_protected/user/settings')({
  component: RouteComponent,
});

const updateUserSchema: z.ZodType<UpdateUser> = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
});

function RouteComponent() {
  const user = useCurrentUser()!;
  const { toast } = useToast();
  const [avatarFile, setAvatarFile] = useState<File | null>();
  const [avatar, setAvatar] = useState<string | null>(
    user.avatarUrl || defaultAvatar,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
    },
  });

  const handleUpdateProfile: SubmitHandler<UpdateUser> = async (data) => {
    try {
      if (avatarFile) {
        await updateAvatar(avatarFile);
      }

      const updatedUser = await updateUser(data);

      if (updatedUser.email !== user.email) {
        location.reload(); //TODO: need to see if i need to invalidate boards too
      }
      await queryClient.invalidateQueries(authQueryOptions);
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] }); //TODO: need to see if i need to invalidate boards too
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      reset({ email: updatedUser.email, fullName: updatedUser.fullName });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.size > FILE_MAX_SIZE_BYTES) {
      alert('Selected file exceeds the maximum size of 1 MB.'); // TODO: add toaster instead
      return;
    }

    setAvatarFile(selectedFile);
    setAvatar(URL.createObjectURL(selectedFile));
  };

  const handleButtonClick = () => {
    if (!inputRef.current) return;

    if (avatarFile) {
      setAvatarFile(null);
      setAvatar(user.avatarUrl || defaultAvatar);
      return;
    }
    inputRef.current.click();
  };

  return (
    <main className="flex h-full items-center justify-center px-2">
      <div className="container max-w-2xl space-y-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account settings
          </p>
        </div>

        <hr />

        <form
          onSubmit={handleSubmit(handleUpdateProfile)}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Profile</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <span>Profile picture</span>
                <div className="flex items-center gap-4">
                  {avatar ? (
                    <div>
                      <Input
                        id="logo"
                        accept=".jpg, .jpeg, .png"
                        type="file"
                        className="hidden"
                        ref={inputRef}
                        onChange={handleFileChange}
                        name="logo"
                      />
                      <img
                        src={avatar}
                        className="size-20 overflow-hidden rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <Loader2 className="size-20 animate-spin" />
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={handleButtonClick}
                  >
                    {avatarFile ? 'Remove' : 'Upload'} image
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  {...register('fullName')}
                  aria-invalid={!!errors.fullName}
                />
                <p className="text-xs text-red-500">
                  {errors.fullName?.message}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                />
                <p className="text-xs text-red-500">{errors.email?.message}</p>
                <p className="text-sm text-muted-foreground">
                  This email will be used for notifications and login.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" asChild>
              <Link to="/select-workspace">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || (!isDirty && !avatarFile)}
            >
              {isSubmitting ? 'Updating...' : 'Update profile'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
