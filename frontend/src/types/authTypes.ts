export type UserRole =
  | "MANAGER"
  | "DISPATCHER"
  | "SAFETY"
  | "FINANCE";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone: string;
  address: string;
  password: string;
  approved: boolean;
  token? :string
}