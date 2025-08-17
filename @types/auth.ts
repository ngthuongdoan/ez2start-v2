export type LoginBody = {
  email: string;
  password: string;
};

export type SignupBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};