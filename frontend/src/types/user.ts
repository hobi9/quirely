export type User = {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
};

export type UserRegistration = Omit<User, 'id'> & {
  password: string;
  confirmPassword: string;
};
export type UserLogin = Omit<UserRegistration, 'fullName' | 'confirmPassword'>;
