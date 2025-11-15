import {
  Bell,
  LogOut,
  Menu,
  Clock,
  FileText,
  AlertCircle,
  Pill,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUser } from "../../hooks/useUser";
import { useDashboard } from "../../hooks/useDashboard";
import { getRoleDisplayName, getRoleIcon } from "../../data/navigation";
import { ModeToggle } from "../ui/mode-toggle";

export function TopBar() {
  const { user, role, setUser, setRole } = useUser();
  const { sidebarOpen, setSidebarOpen, notifications, setNotifications } =
    useDashboard();

  const handleLogout = () => {
    setUser(null);
    setRole(null);
    // Navigate to login page
    window.location.href = "/";
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return Clock;
      case "report":
        return FileText;
      case "system":
        return AlertCircle;
      case "reminder":
        return Pill;
      default:
        return Bell;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const RoleIcon = getRoleIcon(role);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center justify-between px-6 w-full">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-10 w-10 hover:bg-primary/10 hover:text-primary transition-colors mr-6"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <div className="md:hidden">
            <span className="text-sm font-medium text-muted-foreground">
              HealthSync Dashboard
            </span>
          </div>
        </div>

        <nav className="flex items-center space-x-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-[11px] font-bold text-destructive-foreground flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
                        onClick={markAllAsRead}
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const NotificationIcon = getNotificationIcon(
                        notification.type
                      );
                      return (
                        <DropdownMenuItem
                          key={notification.id}
                          className={`cursor-pointer p-4 hover:bg-accent/50 ${
                            !notification.read
                              ? "bg-primary/5 border-l-2 border-l-primary"
                              : ""
                          }`}
                          onClick={() =>
                            markNotificationAsRead(notification.id)
                          }
                        >
                          <div className="flex gap-3 w-full">
                            <div
                              className={`p-2 rounded-full ${
                                notification.type === "appointment"
                                  ? "bg-blue-100 text-blue-600"
                                  : notification.type === "report"
                                  ? "bg-green-100 text-green-600"
                                  : notification.type === "system"
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-purple-100 text-purple-600"
                              }`}
                            >
                              <NotificationIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium leading-none">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <div className="w-2 h-2 rounded-full bg-primary ml-2 mt-1"></div>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground leading-snug">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <div className="px-1">
              <ModeToggle />
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-colors"
                >
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2 p-2">
                    <p className="text-sm font-semibold leading-none">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </p>
                    <div className="flex items-center gap-2 pt-1 px-2 py-1 rounded-md bg-primary/5">
                      <RoleIcon className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-primary">
                        {getRoleDisplayName(role)}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>
    );
  }
