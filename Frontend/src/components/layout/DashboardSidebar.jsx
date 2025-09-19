import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useUser } from "../../hooks/useUser";
import { useDashboard } from "../../hooks/useDashboard";
import { navigationConfig, getRoleDisplayName } from "../../data/navigation";
import { HeartHandshake } from "lucide-react";

export function DashboardSidebar({ className }) {
  const { role } = useUser();
  const { activeTab, setActiveTab, sidebarOpen } = useDashboard();

  const navigationItems = navigationConfig[role] || [];

  return (
    <div
      className={cn(
        "fixed top-13 left-0 h-[calc(100vh-4rem)] w-64 border-r bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60 shadow-lg z-40 transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
    >
      <div className="space-y-6 py-6 h-full overflow-y-auto">
        {/* Logo/Brand */}
        <div className="px-6 py-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <HeartHandshake className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                HealthSync
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                {getRoleDisplayName(role)} Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 flex-1">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.url.split("/").pop();

              return (
                <Button
                  key={item.url}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-11 px-4 font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                      : "hover:bg-primary/5 hover:text-primary text-sidebar-foreground/80 hover:translate-x-1"
                  )}
                  onClick={() => setActiveTab(item.url.split("/").pop())}
                >
                  <Icon
                    className={cn(
                      "mr-3 h-4 w-4 transition-colors",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  />
                  <span className="text-sm">{item.title}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
      </div>
    </div>
  );
}
