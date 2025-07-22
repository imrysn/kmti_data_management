import React from "react";
import { FileUpload } from "../components/FileUpload/FileUpload";

export const Upload: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Files</h1>
        <p className="text-gray-600">Upload your ICD files to the system</p>
      </div>

      <FileUpload />
    </div>
  );
};
export default Upload;
