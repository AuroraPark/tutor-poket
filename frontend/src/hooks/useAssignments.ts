import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentAPI } from "@/lib/api";
import { Assignment } from "@/types";

// 과제 목록 조회
export const useAssignments = (reportId?: number, status?: string) => {
  return useQuery({
    queryKey: ["assignments", reportId, status],
    queryFn: () => assignmentAPI.getAll(),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 특정 과제 조회
export const useAssignment = (id: string) => {
  return useQuery({
    queryKey: ["assignments", id],
    queryFn: () => assignmentAPI.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 과제 생성
export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Assignment, "id" | "createdAt" | "updatedAt">) =>
      assignmentAPI.create(data),
    onSuccess: () => {
      // 과제 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
};

// 과제 수정
export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Assignment> }) =>
      assignmentAPI.update(id, data),
    onSuccess: (_, { id }) => {
      // 과제 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["assignments", id] });
    },
  });
};

// 과제 상태 변경
export const useUpdateAssignmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      assignmentAPI.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      // 과제 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["assignments", id] });
    },
  });
};

// 과제 삭제
export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentAPI.delete(id),
    onSuccess: () => {
      // 과제 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
};
