import React from "react";
import { Navigate } from "react-router-dom";
import { useMeQuery } from "../../Features/api/apiSlice";

export default function AdminGuard({ children }) {
  const { data, isLoading, isError } = useMeQuery();

  if (isLoading) return null; // or loader
  if (isError) return <Navigate to="/loginSignUp" replace />;

  const role = data?.user?.role;
  if (role !== "admin") return <Navigate to="/" replace />;

  return children;
}
