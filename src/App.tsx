import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/authContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout/Layout";

// Pages
import { Login } from "./pages/Login";
import  AdminLogin  from "./pages/admin/AdminLogin";
import { Dashboard } from "./pages/Dashboard";
import { Upload } from "./pages/Upload";
import { Files } from "./pages/Files";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AllFiles } from "./pages/admin/AllFiles";
import { UserManagement } from "./pages/admin/UserManagement";
import { ActivityLogs } from "./pages/admin/ActivityLogs";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Layout>
                  <Upload />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/files"
            element={
              <ProtectedRoute>
                <Layout>
                  <Files />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/files"
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <AllFiles />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/activity"
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <ActivityLogs />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="/admin/AdminLogin" element={<AdminLogin />} />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
