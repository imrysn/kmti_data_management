import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Files, Upload, Download } from "lucide-react";
import * as fileService from "../services/fileService";
import type { FileItem } from "../types";

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalDownloads: 0,
    recentFiles: [] as FileItem[],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load user's files
      const filesResponse = await fileService.getFiles({ limit: 5 });

      // Calculate total downloads
      const totalDownloads =
        filesResponse.files?.reduce(
          (sum, file) => sum + file.downloadCount,
          0
        ) || 0;

      setStats({
        totalFiles: filesResponse.total || 0,
        totalDownloads,
        recentFiles: filesResponse.files || [],
      });
    } catch (error) {
      console.error("Dashboard data load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your file management dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
            <p className="text-xs text-muted-foreground">
              Files uploaded by you
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads}</div>
            <p className="text-xs text-muted-foreground">
              Downloads of your files
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.recentFiles.reduce((sum, file) => sum + file.fileSize, 0) >
              0
                ? `${(
                    stats.recentFiles.reduce(
                      (sum, file) => sum + file.fileSize,
                      0
                    ) /
                    (1024 * 1024)
                  ).toFixed(1)} MB`
                : "0 MB"}
            </div>
            <p className="text-xs text-muted-foreground">Total file size</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Files */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentFiles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No files uploaded yet.{" "}
              <a href="/upload" className="text-blue-600 hover:underline">
                Upload your first file
              </a>
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recentFiles.map((file) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Files className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">{file.originalName}</h3>
                      <p className="text-sm text-gray-500">
                        Uploaded {formatDate(file.createdAt)} •{" "}
                        {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {file.downloadCount} downloads
                    </p>
                    {file.metadata.tags.length > 0 && (
                      <div className="flex space-x-1 mt-1">
                        {file.metadata.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default Dashboard;
