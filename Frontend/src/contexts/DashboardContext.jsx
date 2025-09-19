import { createContext, useState, useCallback } from "react";

const DashboardContext = createContext({
  activeTab: null,
  setActiveTab: () => null,
  sidebarOpen: true,
  setSidebarOpen: () => null,
  notifications: [],
  setNotifications: () => null,
});

export { DashboardContext };

export function DashboardProvider({ children }) {
  const [activeTab, setActiveTabState] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Enhanced setActiveTab that triggers scroll behavior
  const setActiveTab = useCallback((tab) => {
    setActiveTabState(tab);

    // Scroll main content to top with a small delay
    setTimeout(() => {
      const mainElement = document.querySelector(
        'main[class*="overflow-auto"]'
      );
      if (mainElement) {
        mainElement.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }, 50);
  }, []);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "Upcoming Appointment",
      message: "You have an appointment with Dr. Smith tomorrow at 2:00 PM",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "system",
      title: "System Update",
      message: "New features are now available in your dashboard",
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      type: "report",
      title: "Lab Results Available",
      message: "Your recent lab results are ready for review",
      time: "2 days ago",
      read: true,
    },
    {
      id: 4,
      type: "reminder",
      title: "Medication Reminder",
      message: "Remember to take your evening medication",
      time: "3 days ago",
      read: true,
    },
  ]);

  const value = {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    notifications,
    setNotifications,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
