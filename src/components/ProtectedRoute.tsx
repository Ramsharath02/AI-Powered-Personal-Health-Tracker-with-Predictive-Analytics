import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
