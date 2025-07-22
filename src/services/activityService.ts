import api from "./api";
import type { ActivityLog, PaginatedResponse } from "../types";

export const getActivityLogs = async (params: {
  page?: number;
  limit?: number;
  action?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<PaginatedResponse<ActivityLog>> => {
  const response = await api.get("/activity", { params });
  return response.data;
};

export const getActivityStats = async (
  days: number = 30
): Promise<{
  stats: Array<{ _id: string; count: number }>;
  totalActivities: number;
  period: string;
}> => {
  const response = await api.get("/activity/stats", { params: { days } });
  return response.data;
};
