export type User = {
  id: number;
  fullName: string;
  email: string;
};

export type UserRegistration = Omit<User, 'id'> & { password: string };
export type UserLogin = Omit<UserRegistration, 'fullName'>;
