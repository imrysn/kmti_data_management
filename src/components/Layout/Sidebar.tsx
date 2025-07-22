import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/UseAuth";
import { Home, Upload, Files, Users, Activity } from "lucide-react";

export const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();

  const userNavItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/upload", icon: Upload, label: "Upload Files" },
    { to: "/files", icon: Files, label: "My Files" },
  ];

  const adminNavItems = [
    { to: "/admin/dashboard", icon: Home, label: "Admin Dashboard" },
    { to: "/admin/files", icon: Files, label: "All Files" },
    { to: "/admin/users", icon: Users, label: "User Management" },
    { to: "/admin/activity", icon: Activity, label: "Activity Logs" },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
