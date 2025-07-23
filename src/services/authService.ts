import api from "./api";
import type { User } from "../types";

export interface LoginResponse {
  message: string;
  user: User;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("/auth/me");
  return response.data.user;
};

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string;
  fullName?: string;
}

export const register = async (userData: RegisterData): Promise<{ message: string; user: User }> => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};
