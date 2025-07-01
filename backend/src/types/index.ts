import { Request } from "express";

// Express Request 확장
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 튜터 관련 타입
export interface CreateTutorRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// 학생 관련 타입
export interface CreateStudentRequest {
  name: string;
  subject: string;
  contact?: string;
  memo?: string;
  tutorId: number;
}

export interface UpdateStudentRequest {
  name?: string;
  subject?: string;
  contact?: string;
  memo?: string;
  tutorId?: number;
}

// 강의 관련 타입
export interface CreateLessonRequest {
  date: Date;
  topic: string;
  studentId: number;
  status?: "SCHEDULED" | "COMPLETED" | "CANCELED";
}

export interface UpdateLessonRequest {
  date?: Date;
  topic?: string;
  studentId?: number;
  status?: "SCHEDULED" | "COMPLETED" | "CANCELED";
}

export interface UpdateLessonStatusRequest {
  status: "SCHEDULED" | "COMPLETED" | "CANCELED";
}

// 리포트 관련 타입
export interface CreateReportRequest {
  content: string;
  lessonId: number;
}

export interface UpdateReportRequest {
  content: string;
}

// 과제 관련 타입
export interface CreateAssignmentRequest {
  title: string;
  content?: string;
  dueDate?: Date;
  attachment?: string;
  reportId: number;
  status?: "PENDING" | "SUBMITTED" | "REVIEWED";
}

export interface UpdateAssignmentRequest {
  title?: string;
  content?: string;
  dueDate?: Date;
  attachment?: string;
  status?: "PENDING" | "SUBMITTED" | "REVIEWED";
}

export interface UpdateAssignmentStatusRequest {
  status: "PENDING" | "SUBMITTED" | "REVIEWED";
}
