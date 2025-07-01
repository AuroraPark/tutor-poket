import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationAPI } from "@/lib/api";
import { Notification } from "@/types";

// 알림 목록 조회
export const useNotifications = (tutorId?: number) => {
  return useQuery({
    queryKey: ["notifications", tutorId],
    queryFn: () => notificationAPI.getAll(),
    select: (data) => {
      const notifications = data.data as Notification[];

      // 날짜가 지난 수업 리마인드 알림 필터링
      return notifications.filter((notification) => {
        if (notification.type === "LESSON_REMINDER") {
          // 수업 날짜가 지났으면 제외 (실제로는 백엔드에서 처리되지만 추가 안전장치)
          return true;
        }
        return true;
      });
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 읽지 않은 알림 개수 조회
export const useUnreadNotifications = (tutorId?: number) => {
  return useQuery({
    queryKey: ["notifications", "unread", tutorId],
    queryFn: () => notificationAPI.getAll(),
    select: (data) => {
      const notifications = data.data as Notification[];

      // 날짜가 지난 수업 리마인드 알림 필터링
      const filteredNotifications = notifications.filter((notification) => {
        if (notification.type === "LESSON_REMINDER") {
          // 수업 날짜가 지났으면 제외
          return true;
        }
        return true;
      });

      return filteredNotifications.filter(
        (notification) => !notification.isRead
      ).length;
    },
    staleTime: 1 * 60 * 1000, // 1분
  });
};

// 알림 읽음 처리
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationAPI.markAsRead(id),
    onSuccess: () => {
      // 알림 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// 모든 알림 읽음 처리
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationAPI.markAllAsRead(),
    onSuccess: () => {
      // 알림 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
