import api from "./api";
import type { User, PaginatedResponse } from "../types";

export const getUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<User>> => {
  const response = await api.get("/users", { params });
  return response.data;
};

export const getUserById = async (id: string): Promise<{ user: User }> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (
  id: string,
  userData: {
    username?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
  }
): Promise<{ message: string; user: User }> => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const resetUserPassword = async (
  id: string,
  newPassword: string
): Promise<{ message: string }> => {
  const response = await api.post(`/users/${id}/reset-password`, {
    newPassword,
  });
  return response.data;
};
