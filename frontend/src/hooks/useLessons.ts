import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonAPI, studentAPI } from "@/lib/api";
import { Lesson } from "@/types";

// Query Keys
export const lessonKeys = {
  all: ["lessons"] as const,
  lists: () => [...lessonKeys.all, "list"] as const,
  list: (filters: string) => [...lessonKeys.lists(), { filters }] as const,
  details: () => [...lessonKeys.all, "detail"] as const,
  detail: (id: string) => [...lessonKeys.details(), id] as const,
  byStudent: (studentId: string) =>
    [...lessonKeys.all, "student", studentId] as const,
};

// 모든 수업 조회 (날짜 순으로 정렬)
export const useLessons = () => {
  return useQuery({
    queryKey: lessonKeys.lists(),
    queryFn: lessonAPI.getAll,
    staleTime: 5 * 60 * 1000, // 5분
    select: (data) => {
      // 수업을 날짜 순으로 정렬 (가장 가까운 날짜가 먼저)
      if (data.data && Array.isArray(data.data)) {
        const sortedLessons = [...data.data].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
        return {
          ...data,
          data: sortedLessons,
        };
      }
      return data;
    },
  });
};

// 특정 수업 조회
export const useLesson = (id: string) => {
  return useQuery({
    queryKey: lessonKeys.detail(id),
    queryFn: () => lessonAPI.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 학생별 수업 조회
export const useLessonsByStudent = (studentId: string) => {
  return useQuery({
    queryKey: lessonKeys.byStudent(studentId),
    queryFn: () => studentAPI.getLessons(studentId),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 수업 생성
export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lessonAPI.create,
    onSuccess: (data) => {
      // 수업 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });

      // 해당 학생의 수업 목록 캐시 무효화
      if (data.studentId) {
        queryClient.invalidateQueries({
          queryKey: lessonKeys.byStudent(data.studentId),
        });
      }
    },
  });
};

// 수업 수정
export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lesson> }) =>
      lessonAPI.update(id, data),
    onSuccess: (data, variables) => {
      // 수업 목록과 상세 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: lessonKeys.detail(variables.id),
      });

      // 상세 정보 캐시 업데이트
      queryClient.setQueryData(lessonKeys.detail(variables.id), data);

      // 해당 학생의 수업 목록 캐시 무효화
      if (data.studentId) {
        queryClient.invalidateQueries({
          queryKey: lessonKeys.byStudent(data.studentId),
        });
      }
    },
  });
};

// 수업 삭제
export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lessonAPI.delete,
    onSuccess: (_, deletedId) => {
      // 수업 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });

      // 삭제된 수업의 상세 정보 캐시 제거
      queryClient.removeQueries({ queryKey: lessonKeys.detail(deletedId) });
    },
  });
};
