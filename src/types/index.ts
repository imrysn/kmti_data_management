export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string; 
  role: "admin" | "user";
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileMetadata {
  description?: string;
  tags: string[];
  version?: string;
  project?: string;
}

export interface FileItem {
  _id: string;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: {
    _id: string;
    username: string;
    email: string;
  };
  metadata: FileMetadata;
  isActive: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  action: string;
  description: string;
  resourceType?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data?: T[];
  files?: T[];
  users?: T[];
  logs?: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface DashboardStats {
  totalFiles: number;
  totalUsers: number;
  totalDownloads: number;
  recentActivities: ActivityLog[];
}
