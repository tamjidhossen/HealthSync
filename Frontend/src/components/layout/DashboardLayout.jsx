import { cn } from "../../lib/utils";
import { TopBar } from "./TopBar";
import { DashboardSidebar } from "./DashboardSidebar";
import { MainContent } from "./MainContent";
import { useDashboard } from "../../hooks/useDashboard";

export function DashboardLayout({
  children,
  className,
  contentPadding = "default",
  contentScroll = true,
}) {
  const { sidebarOpen } = useDashboard();

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <TopBar />
      <div className="relative h-[calc(100vh-4rem)]">
        <DashboardSidebar />
        <MainContent
          padding={contentPadding}
          scroll={contentScroll}
          className={cn(
            "transition-all duration-300 ease-in-out",
            sidebarOpen ? "ml-64" : "ml-0"
          )}
        >
          {children}
        </MainContent>
      </div>
    </div>
  );
}
