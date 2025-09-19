import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Button } from "../../ui/button";

export function NotificationPanel({ notifications = [] }) {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "reminder":
        return <Bell className="h-4 w-4" />;
      case "appointment":
        return <AlertTriangle className="h-4 w-4" />;
      case "result":
        return <CheckCircle className="h-4 w-4" />;
      case "health_tip":
        return <Info className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-600";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const displayNotifications = notifications.slice(0, 3);

  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Notifications
          </CardTitle>
          <CardDescription>Recent updates and reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No notifications
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          Notifications
          {unreadNotifications.length > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadNotifications.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Recent updates and reminders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 border rounded-lg ${
              !notification.read
                ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700"
                : "hover:bg-muted/50"
            } transition-colors`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 ${
                  getPriorityColor(notification.priority).split(" ")[1]
                }`}
              >
                {getNotificationIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={`font-medium ${
                      !notification.read
                        ? "text-blue-900 dark:text-blue-300"
                        : "dark:text-gray-200"
                    }`}
                  >
                    {notification.title}
                  </h4>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getPriorityColor(
                      notification.priority
                    )}`}
                  >
                    {notification.priority}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">
                  {notification.message}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-gray-500">
                  <span>
                    {new Date(notification.date).toLocaleDateString()} at{" "}
                    {notification.time}
                  </span>
                  {!notification.read && (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {notifications.length > 3 && (
          <Button variant="outline" className="w-full mt-4">
            View All Notifications ({notifications.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
