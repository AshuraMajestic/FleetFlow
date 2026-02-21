import type { User, UserRole } from "../../types/authTypes";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@fleet.com",
    role: "MANAGER",
    password: "1234",
    approved: true,
    name: "Admin",
    phone: "",
    address: "",
  },
  {
    id: "2",
    email: "finance@fleet.com",
    role: "FINANCE",
    password: "",
    approved: false,
    name: "",
    phone: "",
    address: "",
  },
  {
    id: "3",
    email: "saf@fleet.com",
    role: "SAFETY",
    password: "1234",
    approved: true,
    name: "Admin",
    phone: "",
    address: "",
  },
];