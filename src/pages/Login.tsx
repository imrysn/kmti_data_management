import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import Button from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";

export const Login: React.FC = () => {
  console.log("Login component rendered"); // Add this line
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return (
      <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} replace />
    );
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
      console.error("Login error:", error);
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
    <div className="bg-[#d9d9d9] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#d9d9d9] w-full max-w-[1920px] h-[1080px] relative">
        {/* Header */}
        <header className="absolute w-full h-[67px] top-0 left-0 bg-[#44444c]">
          <nav>
            <div className="absolute w-[53px] top-5 left-8 [font-family:'Archivo',Helvetica] font-light text-white text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
              Help
            </div>
          </nav>
        </header>

        {/* Logo */}
        <img
          className="absolute w-[211px] h-[211px] top-[150px] left-1/2 -translate-x-1/2 object-cover"
          alt="KMTI logo"
          src="/kmti-logo-removebg-preview-1.png"
        />

        {/* Login Card */}
        <Card className="absolute w-[425px] h-[354px] top-[428px] left-1/2 -translate-x-1/2 bg-[#00000017] rounded-[15px] border-none shadow-none">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit}>
              {/* Card Title */}
              <div className="absolute w-[76px] top-[35px] left-[175px] [font-family:'Archivo',Helvetica] font-medium text-black text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
                USER
              </div>

              {/* Username Input */}
              <div className="absolute w-[370px] h-[55px] top-[105px] left-7">
                <Input
                  className="h-[55px] bg-white rounded-[10px] pl-[13px] [font-family:'Archivo',Helvetica] font-light text-[#00000070] text-xl"
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
              </div>

              {/* Password Input */}
              <div className="absolute w-[370px] h-[55px] top-[190px] left-7">
                <Input
                  type="password"
                  className="h-[55px] bg-white rounded-[10px] pl-[13px] [font-family:'Archivo',Helvetica] font-light text-[#00000070] text-xl"
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
              </div>

              {/* Login Button */}
              <div className="absolute w-[130px] h-[45px] top-[276px] left-[149px]">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-32 h-[45px] bg-black text-white rounded-[10px] [font-family:'Archivo',Helvetica] font-normal text-xl hover:bg-black/90 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>

              {/* Reset Password Link */}
              <button
                type="button"
                className="absolute w-[86px] top-[330px] left-[170px] [font-family:'Archivo',Helvetica] font-light text-black text-xs tracking-[0] leading-[normal]"
              >
                Reset password
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="absolute top-[800px] left-1/2 -translate-x-1/2 bg-white/80 p-4 rounded-lg text-center">
          <p className="text-sm font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs">Admin: admin / admin123</p>
          <p className="text-xs">User: user / user123</p>
        </div>
      </div>
    </div>
  );
};
export default Login;
