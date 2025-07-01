import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const queryClient = useQueryClient();

  // 초기 인증 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        // JSON 파싱 실패 시 로컬 스토리지 클리어
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  // 프로필 조회
  const { data: profile } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: authAPI.getProfile,
    enabled: authState.isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 통계 조회
  const { data: stats } = useQuery({
    queryKey: ["auth", "stats"],
    queryFn: authAPI.getStats,
    enabled: authState.isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 로그인 뮤테이션
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.login(email, password),
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.tutor));
      setAuthState({
        user: data.data.tutor,
        isAuthenticated: true,
        isLoading: false,
      });
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
  });

  // 회원가입 뮤테이션
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.tutor));
      setAuthState({
        user: data.data.tutor,
        isAuthenticated: true,
        isLoading: false,
      });
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
  });

  // 로그아웃 뮤테이션
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      queryClient.clear(); // 모든 캐시 클리어
    },
  });

  // 로그인 함수
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({ email, password });
      return true;
    } catch (error) {
      return false;
    }
  };

  // 회원가입 함수
  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      await registerMutation.mutateAsync(data);
      return true;
    } catch (error) {
      return false;
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // 에러가 발생해도 로컬에서 로그아웃 처리
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      queryClient.clear();
    }
  };

  return {
    // 상태
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,

    // 프로필
    profile,

    // 통계
    stats,

    // 함수들
    login,
    register,
    logout,

    // 뮤테이션 상태
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
    logoutLoading: logoutMutation.isPending,

    // 에러
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,

    // 에러 메시지
    error:
      loginMutation.error?.message ||
      registerMutation.error?.message ||
      logoutMutation.error?.message,
  };
};
