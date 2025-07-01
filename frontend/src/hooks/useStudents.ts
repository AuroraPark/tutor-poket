import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentAPI } from "@/lib/api";
import { Student } from "@/types";

// Query Keys
export const studentKeys = {
  all: ["students"] as const,
  lists: () => [...studentKeys.all, "list"] as const,
  list: (filters: string) => [...studentKeys.lists(), { filters }] as const,
  details: () => [...studentKeys.all, "detail"] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
};

// 모든 학생 조회
export const useStudents = () => {
  return useQuery({
    queryKey: studentKeys.lists(),
    queryFn: studentAPI.getAll,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 특정 학생 조회
export const useStudent = (id: string) => {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentAPI.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 학생 생성
export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentAPI.create,
    onSuccess: () => {
      // 학생 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
  });
};

// 학생 수정
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) =>
      studentAPI.update(id, data),
    onSuccess: (data, variables) => {
      // 학생 목록과 상세 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: studentKeys.detail(variables.id),
      });

      // 상세 정보 캐시 업데이트
      queryClient.setQueryData(studentKeys.detail(variables.id), data);
    },
  });
};

// 학생 삭제
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentAPI.delete,
    onSuccess: (_, deletedId) => {
      // 학생 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });

      // 삭제된 학생의 상세 정보 캐시 제거
      queryClient.removeQueries({ queryKey: studentKeys.detail(deletedId) });
    },
  });
};
