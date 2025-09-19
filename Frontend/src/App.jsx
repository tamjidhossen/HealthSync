import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContextValue";
import { UserProvider } from "./contexts/UserContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="healthsync-ui-theme">
      <AuthProvider>
        <UserProvider>
          <DashboardProvider>
            <Outlet />
            <Toaster position="bottom-right" richColors />
          </DashboardProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
