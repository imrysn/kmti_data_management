import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/useAuth";
import * as fileService from "../services/fileService";
import * as userService from "../services/userService";

export const TestComponent: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTests = async () => {
    const results: string[] = [];

    try {
      // Test file service
      const files = await fileService.getFiles({ limit: 1 });
      results.push(`✅ File service: ${files.total || 0} files found`);
    } catch {
      results.push("❌ File service failed");
    }

    if (isAdmin) {
      try {
        // Test user service (admin only)
        const users = await userService.getUsers({ limit: 1 });
        results.push(`✅ User service: ${users.total || 0} users found`);
      } catch {
        results.push("❌ User service failed");
      }
    }

    setTestResults(results);
  };

  useEffect(() => {
    if (user) {
      runTests();
    }
  }, [user]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">System Tests</h3>
      <div className="space-y-1">
        {testResults.map((result, index) => (
          <div key={index} className="text-sm">
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};
