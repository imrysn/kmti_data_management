import React from "react";
import { FileList } from "../../components/FileList/FileList";

export const AllFiles: React.FC = () => {
  return (
    <div className="space-y-6">
      <FileList showAllFiles={true} />
    </div>
  );
};
export default AllFiles;
