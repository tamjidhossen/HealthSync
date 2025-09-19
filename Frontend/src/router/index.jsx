import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import LandingPage from "../pages/landing-page";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardRedirect from "../components/DashboardRedirect";
import { PatientDashboard } from "../pages/dashboard/PatientDashboard";
import DoctorDashboard from "../pages/dashboard/DoctorDashboard";
import { InstituteDashboard } from "../pages/dashboard/InstituteDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/patient",
        element: (
          <ProtectedRoute requiredRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/doctor",
        element: (
          <ProtectedRoute requiredRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/institute",
        element: (
          <ProtectedRoute requiredRole="institute">
            <InstituteDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/admin",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
