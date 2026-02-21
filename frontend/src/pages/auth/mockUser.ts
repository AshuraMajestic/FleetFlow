import type { User, UserRole } from "../../types/authTypes";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@fleet.com",
    role: "MANAGER",
    password: "1234",
    isRegistered: true,
    name: "Admin",
    phone: "",
    address: "",
  },
  {
    id: "2",
    email: "finance@fleet.com",
    role: "FINANCE",
    password: "",
    isRegistered: false,
    name: "",
    phone: "",
    address: "",
  },
];