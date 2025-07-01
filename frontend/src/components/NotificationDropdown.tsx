import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  Trash2,
  Clock,
  BookOpen,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  useNotifications,
  useUnreadNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks";
import { Notification } from "@/types";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { data: notificationsData } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const notifications = (notificationsData as Notification[]) || [];

  const handleNotificationClick = (notification: Notification) => {
    // 알림을 읽음 처리
    markAsRead.mutate(notification.id.toString());

    // 알림 타입에 따라 다른 페이지로 이동
    if (notification.lessonId && notification.lesson?.student?.id) {
      // 수업 관련 알림인 경우 해당 학생의 상세 페이지로 이동
      navigate(`/students/${notification.lesson.student.id}`);
    }

    // 드롭다운 닫기
    setIsOpen(false);
  };

  const handleMarkAsRead = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    markAsRead.mutate(id.toString());
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "LESSON_REMINDER":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "REPORT_READY":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "ASSIGNMENT_DUE":
        return <BookOpen className="h-4 w-4 text-orange-500" />;
      case "GENERAL":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationTypeText = (type: Notification["type"]) => {
    switch (type) {
      case "LESSON_REMINDER":
        return "수업 알림";
      case "REPORT_READY":
        return "리포트";
      case "ASSIGNMENT_DUE":
        return "과제";
      case "GENERAL":
        return "일반";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "방금 전";
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      return date.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4 mr-2" />
          알림
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-96 overflow-y-auto"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>알림</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-6 px-2 text-xs"
            >
              모두 읽음 처리
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <DropdownMenuItem
            disabled
            className="text-center text-muted-foreground"
          >
            알림이 없습니다
          </DropdownMenuItem>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex items-start space-x-3 p-3 cursor-pointer ${
                !notification.isRead ? "bg-blue-50" : ""
              }`}
              onClick={(event) => handleNotificationClick(notification)}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-medium ${
                      !notification.isRead ? "text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {notification.title}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {getNotificationTypeText(notification.type)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(notification.createdAt)}
                </p>
              </div>
              {!notification.isRead && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </DropdownMenuItem>
          ))
        )}

        {notifications.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-blue-600">
              모든 알림 보기
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
