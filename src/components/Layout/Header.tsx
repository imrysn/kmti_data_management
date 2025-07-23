import React from "react";
import { useAuth } from "../../contexts/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Navigation items with path and label
  const navItems = [
    { path: "/admin/files", label: "Data Management" },
    { path: "/admin/users", label: "User Management" },
    { path: "/admin/activity", label: "Activity Logs" },
    { path: "/admin/dashboard", label: "System Settings" },
  ];

  return (
    <header className="bg-[#44444c] text-white px-6 h-[40px] flex items-center justify-between w-full">
      <nav className="flex space-x-8">
        {navItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`text-sm ${
              location.pathname === item.path ? "underline" : ""
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center space-x-8">
        <span className="text-white text-sm">
          Hi, {user?.username || "User"}
        </span>
        <button
          className="text-white text-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};
