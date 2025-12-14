import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // Kiểm tra quyền admin
  const isAdmin = user.email === "admin@example.com"; // hoặc user_metadata.role === 'admin'

  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;