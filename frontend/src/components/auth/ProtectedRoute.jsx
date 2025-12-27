import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../../lib/api/apiClient";
import useAuthStore from "../../lib/store/authStore";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, setAuth, clearAuth, token, isAuthenticated } = useAuthStore();

  // Only fetch if we have a token
  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await api.get("/auth/profile");
      return response.data;
    },
    retry: 1,
    enabled: !!token, // Only run if token exists
  });

  // error case - clear auth
  useEffect(() => {
    if (isError && error) {
      clearAuth();
    }
  }, [isError, error, clearAuth]);

  // success case - update user data
  useEffect(() => {
    if (isSuccess && data) {
      setAuth(data, token);
    }
  }, [isSuccess, data, setAuth, token]);

  // No token at all - redirect immediately
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  // Auth error - redirect to login
  if (isError) {
    console.log("Auth error, redirecting to login:", error?.message);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // No user data after successful fetch - redirect
  if (!user && !isLoading) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
