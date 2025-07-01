import axios from "axios";

// API 기본 설정
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 백엔드 서버 주소
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (토큰 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// 인증 API
export const authAPI = {
  // 로그인
  login: (email: string, password: string) =>
    api.post("/tutors/login", { email, password }).then((res) => res.data),

  // 회원가입
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/tutors/register", data).then((res) => res.data),

  // 로그아웃
  logout: () => api.post("/tutors/logout").then((res) => res.data),

  // 프로필 조회
  getProfile: () => api.get("/tutors/profile").then((res) => res.data),

  // 통계 조회
  getStats: () => api.get("/tutors/stats").then((res) => res.data),

  // 토큰 갱신
  refreshToken: () => api.post("/tutors/refresh").then((res) => res.data),
};

// API 함수들
export const studentAPI = {
  // 모든 학생 조회
  getAll: () => api.get("/students").then((res) => res.data),

  // 특정 학생 조회
  getById: (id: string) => api.get(`/students/${id}`).then((res) => res.data),

  // 학생별 수업 조회
  getLessons: (studentId: string) =>
    api.get(`/students/${studentId}/lessons`).then((res) => res.data),

  // 학생 생성
  create: (
    data: Omit<import("@/types").Student, "id" | "createdAt" | "updatedAt">
  ) => api.post("/students", data).then((res) => res.data),

  // 학생 수정
  update: (id: string, data: Partial<import("@/types").Student>) =>
    api.put(`/students/${id}`, data).then((res) => res.data),

  // 학생 삭제
  delete: (id: string) => api.delete(`/students/${id}`).then((res) => res.data),
};

export const lessonAPI = {
  // 모든 수업 조회
  getAll: () => api.get("/lessons").then((res) => res.data),

  // 특정 수업 조회
  getById: (id: string) => api.get(`/lessons/${id}`).then((res) => res.data),

  // 학생별 수업 조회
  getByStudentId: (studentId: string) =>
    api.get(`/students/${studentId}/lessons`).then((res) => res.data),

  // 수업 생성
  create: (
    data: Omit<import("@/types").Lesson, "id" | "createdAt" | "updatedAt">
  ) => api.post("/lessons", data).then((res) => res.data),

  // 수업 수정
  update: (id: string, data: Partial<import("@/types").Lesson>) =>
    api.put(`/lessons/${id}`, data).then((res) => res.data),

  // 수업 삭제
  delete: (id: string) => api.delete(`/lessons/${id}`).then((res) => res.data),
};

export const tutorAPI = {
  // 튜터 정보 조회
  getProfile: () => api.get("/tutors/profile").then((res) => res.data),

  // 튜터 정보 수정
  updateProfile: (data: Partial<import("@/types").Tutor>) =>
    api.put("/tutors/profile", data).then((res) => res.data),
};

export const assignmentAPI = {
  // 모든 과제 조회
  getAll: () => api.get("/assignments").then((res) => res.data),

  // 특정 과제 조회
  getById: (id: string) =>
    api.get(`/assignments/${id}`).then((res) => res.data),

  // 학생별 과제 조회
  getByStudentId: (studentId: string) =>
    api.get(`/students/${studentId}/assignments`).then((res) => res.data),

  // 과제 생성
  create: (
    data: Omit<import("@/types").Assignment, "id" | "createdAt" | "updatedAt">
  ) => api.post("/assignments", data).then((res) => res.data),

  // 과제 수정
  update: (id: string, data: Partial<import("@/types").Assignment>) =>
    api.put(`/assignments/${id}`, data).then((res) => res.data),

  // 과제 상태 변경
  updateStatus: (id: string, status: string) =>
    api.patch(`/assignments/${id}/status`, { status }).then((res) => res.data),

  // 과제 삭제
  delete: (id: string) =>
    api.delete(`/assignments/${id}`).then((res) => res.data),
};

export const notificationAPI = {
  // 모든 알림 조회
  getAll: () => api.get("/notifications").then((res) => res.data),

  // 알림 읽음 처리
  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`).then((res) => res.data),

  // 모든 알림 읽음 처리
  markAllAsRead: () =>
    api.patch("/notifications/read-all").then((res) => res.data),
};

export const reportAPI = {
  // 모든 리포트 조회
  getAll: () => api.get("/reports").then((res) => res.data),

  // 특정 리포트 조회
  getById: (id: string) => api.get(`/reports/${id}`).then((res) => res.data),

  // 강의별 리포트 조회
  getByLessonId: (lessonId: string) =>
    api.get(`/reports?lessonId=${lessonId}`).then((res) => res.data),

  // 리포트 생성
  create: (data: { content: string; lessonId: number }) =>
    api.post("/reports", data).then((res) => res.data),

  // 리포트 수정
  update: (id: string, data: { content: string }) =>
    api.put(`/reports/${id}`, data).then((res) => res.data),

  // 리포트 삭제
  delete: (id: string) => api.delete(`/reports/${id}`).then((res) => res.data),
};

export default api;
