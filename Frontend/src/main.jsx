import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import { router } from "./router/index.jsx";
import { Toaster } from "sonner";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="healthsync-ui-theme">
      <UserProvider>
        <DashboardProvider>
          <RouterProvider router={router} />
          {/* <Toaster position="top-right" richColors /> */}
        </DashboardProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>
);
