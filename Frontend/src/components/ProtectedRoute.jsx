import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * ProtectedRoute component that requires authentication
 * Redirects to landing page if user is not authenticated
 */
export function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing page if not authenticated
  if (!isAuthenticated) {
    // return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check role-based access if required
  // if (requiredRole && user?.role !== requiredRole) {
  //   // Redirect to appropriate dashboard based on user's role
  //   const userDashboard = `/dashboard/${user?.role || "patient"}`;
  //   return <Navigate to={userDashboard} replace />;
  // }

  // If no specific role required, allow access
  return children;
}

export default ProtectedRoute;
