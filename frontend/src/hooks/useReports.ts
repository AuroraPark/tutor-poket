import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportAPI } from "@/lib/api";

// 리포트 목록 조회
export const useReports = (lessonId?: number) => {
  return useQuery({
    queryKey: ["reports", lessonId],
    queryFn: () => reportAPI.getAll(),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 특정 리포트 조회
export const useReport = (id: string) => {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: () => reportAPI.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 강의별 리포트 조회
export const useReportByLesson = (lessonId: string) => {
  return useQuery({
    queryKey: ["reports", "lesson", lessonId],
    queryFn: () => reportAPI.getByLessonId(lessonId),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 리포트 생성
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { content: string; lessonId: number }) =>
      reportAPI.create(data),
    onSuccess: () => {
      // 리포트 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

// 리포트 수정
export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { content: string } }) =>
      reportAPI.update(id, data),
    onSuccess: (_, { id }) => {
      // 리포트 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports", id] });
    },
  });
};

// 리포트 삭제
export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reportAPI.delete(id),
    onSuccess: () => {
      // 리포트 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};
