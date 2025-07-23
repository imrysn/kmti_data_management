import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import Button from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import KMTILogo from "../../assets/kmti-logo.png";

const AdminLogin: React.FC = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(credentials.username, credentials.password);
      toast.success("Login successful!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Server error occurred";
        toast.error(`Login failed: ${errorMessage}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#d9d9d9] flex flex-col justify-center items-center w-full min-h-screen relative">
      {/* Header */}
      <header className="w-full h-[67px] bg-[#44444c] flex items-center absolute top-0 left-0">
        <div className="pl-8 [font-family:'Archivo',Helvetica] font-light text-white text-2xl">
          Help
        </div>
      </header>

      {/* Logo */}
      <img
        className="w-[211px] h-[211px] mt-[120px] mb-2 object-cover"
        alt="KMTI logo"
        src={KMTILogo}
        style={{ zIndex: 1 }}
      />

      {/* Login Card */}
      <Card className="w-[425px] h-[354px] bg-[#00000017] rounded-[15px] border-none shadow-none flex flex-col items-center justify-center">
        <CardContent className="w-full flex flex-col items-center justify-center p-0">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center"
          >
            {/* Card Title */}
            <div className="[font-family:'Archivo',Helvetica] font-medium text-black text-2xl mb-6 mt-8">
              ADMINISTRATOR
            </div>

            {/* Username Input */}
            <Input
              className="w-[370px] h-[55px] bg-white rounded-[10px] pl-[13px] mb-4 [font-family:'Archivo',Helvetica] font-light text-[#00000070] text-xl"
              placeholder="Username:"
              value={credentials.username}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              disabled={loading}
            />

            {/* Password Input */}
            <Input
              type="password"
              className="w-[370px] h-[55px] bg-white rounded-[10px] pl-[13px] mb-4 [font-family:'Archivo',Helvetica] font-light text-[#00000070] text-xl"
              placeholder="Password:"
              value={credentials.password}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              disabled={loading}
            />

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-[130px] h-[45px] bg-black text-white rounded-[10px] [font-family:'Archivo',Helvetica] font-normal text-xl hover:bg-black/90 disabled:opacity-50 mb-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                "Login"
              )}
            </Button>

            {/* Reset Password Link */}
            <button
              type="button"
              className="[font-family:'Archivo',Helvetica] font-light text-black text-xs"
              style={{ background: "none", border: "none", marginTop: "4px" }}
            >
              Reset password
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Login as User Link */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          type="button"
          className="[font-family:'Archivo',Helvetica] text-black text-sm underline hover:text-blue-700"
          onClick={() => navigate("/login")}
          style={{ background: "none", border: "none" }}
        >
          Login as User
        </button>
      </div>
    </div>
    );
}
export default AdminLogin;