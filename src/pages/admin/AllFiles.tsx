import React, { useState, useRef, useEffect } from "react";
import { FileList } from "../../components/FileList/FileList";
import {FileUpload} from "../../components/FileUpload/FileUpload";

// Example folder navigation state
type Folder = {
  id: string;
  name: string;
  parentId?: string;
};

export const AllFiles: React.FC = () => {
  // Simulate folder navigation stack
  const [folderStack, setFolderStack] = useState<Folder[]>([
    { id: "root", name: "My Drive" }
  ]);
  const [currentFolder, setCurrentFolder] = useState<Folder>(folderStack[0]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Debounce search input (Google Drive style)
  useEffect(() => {
    // Only debounce if search is not empty
    if (search === "") {
      setDebouncedSearch("");
      return;
    }
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400); // 400ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Breadcrumb navigation (like Google Drive)
  const handleBreadcrumbClick = (index: number) => {
    setFolderStack(folderStack.slice(0, index + 1));
    setCurrentFolder(folderStack[index]);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Implement your upload logic here for currentFolder
    }
    setShowUploadDropdown(false);
  };

  // Handle folder upload
  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Implement your folder upload logic here for currentFolder
    }
    setShowUploadDropdown(false);
  };

  // Handle create folder
  const handleCreateFolder = () => {
    // Example: prompt for folder name
    const folderName = prompt("Enter new folder name:");
    if (folderName) {
      const newFolder: Folder = {
        id: `${Date.now()}`,
        name: folderName,
        parentId: currentFolder.id,
      };
      setFolderStack([...folderStack, newFolder]);
      setCurrentFolder(newFolder);
      // You should also update your file system data here
    }
  };

  // Callback to handle files uploaded from FileUpload component
  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    setShowFileUpload(false);
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen w-full">
      {/* Top bar: Navigation, Upload/Create, Search */}
      <div className="flex items-center justify-between px-8 pt-6 pb-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2">
          {folderStack.map((folder, idx) => (
            <React.Fragment key={folder.id}>
              <button
                className={`text-sm font-medium ${
                  idx === folderStack.length - 1
                    ? "text-black"
                    : "text-blue-600 hover:underline"
                }`}
                onClick={() => handleBreadcrumbClick(idx)}
                disabled={idx === folderStack.length - 1}
              >
                {folder.name}
              </button>
              {idx < folderStack.length - 1 && (
                <span className="mx-1 text-gray-400">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>
        {/* Actions */}
        <div className="flex space-x-2 relative">
          {/* Upload Dropdown Button */}
          <div className="relative">
            <button
              className="bg-white border border-gray-400 px-3 py-1 text-sm rounded shadow"
              onClick={() => setShowUploadDropdown((prev) => !prev)}
            >
              <span className="mr-1">&#8679;</span> Upload{" "}
              <span className="ml-1">&#9660;</span>
            </button>
            {showUploadDropdown && (
              <div className="absolute left-0 top-full mt-1 bg-white border rounded shadow z-10 w-[140px]">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setShowFileUpload(true);
                    setShowUploadDropdown(false);
                  }}
                >
                  Upload File
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    folderInputRef.current?.click();
                  }}
                >
                  Upload Folder
                </button>
              </div>
            )}
            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <input
              type="file"
              webkitdirectory="true"
              directory="true"
              multiple
              ref={folderInputRef}
              style={{ display: "none" }}
              onChange={handleFolderUpload}
            />
          </div>
          {/* Create Folder Button */}
          <button
            className="bg-white border border-gray-400 px-3 py-1 text-sm rounded shadow"
            onClick={handleCreateFolder}
          >
            <span className="mr-1">&#43;</span> New Folder
          </button>
        </div>
        {/* Search bar */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search Drive"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-400 rounded px-2 py-1 text-sm w-[200px] bg-white"
          />
          <span className="ml-2">
            <svg width="20" height="20" fill="black" viewBox="0 0 24 24">
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Show FileUpload modal/component */}
      {showFileUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <FileUpload onFilesUploaded={handleFilesUploaded} />
            <button
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
              onClick={() => setShowFileUpload(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FileList and preview area */}
      <div className="flex flex-1 px-8 pb-8">
        {/* FileList grid */}
        <div className="flex-1">
          {/* Pass uploadedFiles to FileList */}
          <FileList
            showAllFiles={true}
            search={debouncedSearch}
            currentFolder={currentFolder}
            uploadedFiles={uploadedFiles}
          />
        </div>
        {/* Preview area */}
        <div className="bg-white border border-gray-300 w-[500px] h-[400px] flex items-center justify-center ml-8 shadow">
          <span className="text-gray-600 text-sm">
            Select file to preview.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AllFiles;
