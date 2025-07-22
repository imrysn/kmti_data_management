import React, { useState, useEffect, useCallback } from "react";
import { Search, Download, Trash2, Grid, List } from "lucide-react";
import Button from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import type { FileItem } from "../../types";
import * as fileService from "../../services/fileService";
import { useAuth } from "../../contexts/UseAuth";
import toast from "react-hot-toast";

interface FileListProps {
  showAllFiles?: boolean;
}

export const FileList: React.FC<FileListProps> = ({ showAllFiles = false }) => {
  const { isAdmin } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fileService.getFiles({
        page: currentPage,
        limit: 12,
        search,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setFiles(response.files || []);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Failed to load files");
      console.error("Load files error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleDownload = async (file: FileItem) => {
    try {
      const blob = await fileService.downloadFile(file._id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("File downloaded successfully");
    } catch (error) {
      toast.error("Failed to download file");
      console.error("Download error:", error);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await fileService.deleteFile(fileId);
      toast.success("File deleted successfully");
      loadFiles();
    } catch (error) {
      toast.error("Failed to delete file");
      console.error("Delete error:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;
    if (
      !confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)
    )
      return;

    try {
      await fileService.bulkDeleteFiles(selectedFiles);
      toast.success(`${selectedFiles.length} files deleted successfully`);
      setSelectedFiles([]);
      loadFiles();
    } catch (error) {
      toast.error("Failed to delete files");
      console.error("Bulk delete error:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold">
          {showAllFiles ? "All Files" : "My Files"}
        </h2>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {isAdmin && selectedFiles.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-700">
            {selectedFiles.length} file(s) selected
          </span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Files Grid/List */}
      {files.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No files found</p>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {files.map((file) => (
            <Card key={file._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {isAdmin && (
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFiles((prev) => [...prev, file._id]);
                        } else {
                          setSelectedFiles((prev) =>
                            prev.filter((id) => id !== file._id)
                          );
                        }
                      }}
                      className="rounded"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <h3
                      className="font-medium text-sm truncate"
                      title={file.originalName}
                    >
                      {file.originalName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.fileSize)}
                    </p>
                  </div>

                  {file.metadata?.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {file.metadata.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {file.metadata?.tags?.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {file.metadata?.tags && file.metadata.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{file.metadata.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Uploaded: {formatDate(file.createdAt)}</p>
                    {showAllFiles && <p>By: {file.uploadedBy.username}</p>}
                    <p>Downloads: {file.downloadCount}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(file)}
                      className="flex-1"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>

                    {(isAdmin || file.uploadedBy._id) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(file._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>

          <span className="flex items-center px-4 py-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
