import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Component that redirects users to their role-specific dashboard
 */
export function DashboardRedirect() {
  // const { user } = useAuth();

  // For testing - redirect to patient dashboard by default
  const dashboardPath = `/dashboard/patient`;
  // const dashboardPath = `/dashboard/${user?.role || "patient"}`;

  return <Navigate to={dashboardPath} replace />;
}

export default DashboardRedirect;
