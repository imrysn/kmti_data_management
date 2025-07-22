import api from "./api";
import type { FileItem, PaginatedResponse } from "../types";

export const uploadFile = async (
  file: File,
  metadata: {
    description?: string;
    tags?: string;
    version?: string;
    project?: string;
  }
): Promise<{ message: string; file: FileItem }> => {
  const formData = new FormData();
  formData.append("file", file);

  if (metadata.description)
    formData.append("description", metadata.description);
  if (metadata.tags) formData.append("tags", metadata.tags);
  if (metadata.version) formData.append("version", metadata.version);
  if (metadata.project) formData.append("project", metadata.project);

  const response = await api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getFiles = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<PaginatedResponse<FileItem>> => {
  const response = await api.get("/files", { params });
  return response.data;
};

export const getFileById = async (id: string): Promise<{ file: FileItem }> => {
  const response = await api.get(`/files/${id}`);
  return response.data;
};

export const downloadFile = async (id: string): Promise<Blob> => {
  const response = await api.get(`/files/${id}/download`, {
    responseType: "blob",
  });
  return response.data;
};

export const updateFile = async (
  id: string,
  metadata: {
    description?: string;
    tags?: string;
    version?: string;
    project?: string;
  }
): Promise<{ message: string; file: FileItem }> => {
  const response = await api.put(`/files/${id}`, metadata);
  return response.data;
};

export const deleteFile = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/files/${id}`);
  return response.data;
};

export const bulkDeleteFiles = async (
  fileIds: string[]
): Promise<{ message: string; deletedCount: number }> => {
  const response = await api.post("/files/bulk-delete", { fileIds });
  return response.data;
};
