import api from "./api";
import type { User } from "../types";

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export const logout = async (token: string): Promise<void> => {
  await api.post(
    "/auth/logout",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await api.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.user;
};

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
  role?: string;
}): Promise<{ message: string; user: User }> => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};
