import useAuthStore from '../stores/authStore';

const Avatar = () => {
  const { fullName, avatarUrl } = useAuthStore((state) => state.user!);
  return (
    <img
      src={avatarUrl}
      alt={`${fullName}'s avatar`}
      className="size-9 rounded-full transition hover:cursor-pointer hover:opacity-75"
    />
  );
};

export default Avatar;
