import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateTutorRequest, LoginRequest, ApiResponse } from "../types";
import {
  hashPassword,
  comparePassword,
  validatePassword,
} from "../utils/passwordUtils";
import { generateToken } from "../utils/jwtUtils";

export const createTutor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password }: CreateTutorRequest = req.body;

    // 비밀번호 유효성 검사
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      res.status(400).json({
        success: false,
        error: passwordValidation.message,
      } as ApiResponse);
      return;
    }

    // 이메일 중복 확인
    const existingTutor = await prisma.tutor.findUnique({
      where: { email },
    });

    if (existingTutor) {
      res.status(400).json({
        success: false,
        error: "이미 존재하는 이메일입니다.",
      } as ApiResponse);
      return;
    }

    // 비밀번호 해시화
    const hashedPassword = await hashPassword(password);

    // 튜터 생성
    const tutor = await prisma.tutor.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 비밀번호 제외하고 응답
    const { password: _, ...tutorWithoutPassword } = tutor;

    res.status(201).json({
      success: true,
      data: tutorWithoutPassword,
      message: "튜터가 성공적으로 생성되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("튜터 생성 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // 튜터 찾기
    const tutor = await prisma.tutor.findUnique({
      where: { email },
    });

    if (!tutor) {
      res.status(401).json({
        success: false,
        error: "이메일 또는 비밀번호가 올바르지 않습니다.",
      } as ApiResponse);
      return;
    }

    // 비밀번호 검증
    const isPasswordValid = await comparePassword(password, tutor.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: "이메일 또는 비밀번호가 올바르지 않습니다.",
      } as ApiResponse);
      return;
    }

    // JWT 토큰 생성
    const token = generateToken({
      tutorId: tutor.id,
      email: tutor.email,
    });

    // 비밀번호 제외하고 응답
    const { password: _, ...tutorWithoutPassword } = tutor;

    res.json({
      success: true,
      data: {
        tutor: tutorWithoutPassword,
        token: token,
      },
      message: "로그인이 성공했습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // JWT 토큰에서 튜터 ID 추출
    const tutorId = (req as any).user?.tutorId;

    if (!tutorId) {
      res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
      } as ApiResponse);
      return;
    }

    // 튜터 정보 조회
    const tutor = await prisma.tutor.findUnique({
      where: { id: tutorId },
      select: {
        id: true,
        name: true,
        email: true,
        students: {
          select: {
            id: true,
            name: true,
            contact: true,
            subject: true,
            memo: true,
            lessons: {
              select: {
                id: true,
                date: true,
                topic: true,
                status: true,
              },
              orderBy: {
                date: "desc",
              },
              take: 5, // 각 학생당 최근 5개 수업만
            },
          },
        },
      },
    });

    if (!tutor) {
      res.status(404).json({
        success: false,
        error: "튜터를 찾을 수 없습니다.",
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: tutor,
      message: "프로필 조회가 성공했습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("프로필 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const getTutors = async (req: Request, res: Response): Promise<void> => {
  try {
    const tutors = await prisma.tutor.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        students: {
          select: {
            id: true,
            name: true,
            subject: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: tutors,
    } as ApiResponse);
  } catch (error) {
    console.error("튜터 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // 튜터 찾기
    const tutor = await prisma.tutor.findUnique({
      where: { id: Number(id) },
    });

    if (!tutor) {
      res.status(404).json({
        success: false,
        error: "튜터를 찾을 수 없습니다.",
      } as ApiResponse);
      return;
    }

    // 현재 비밀번호 검증
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      tutor.password
    );
    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        error: "현재 비밀번호가 올바르지 않습니다.",
      } as ApiResponse);
      return;
    }

    // 새 비밀번호 유효성 검사
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      res.status(400).json({
        success: false,
        error: passwordValidation.message,
      } as ApiResponse);
      return;
    }

    // 새 비밀번호 해시화
    const hashedNewPassword = await hashPassword(newPassword);

    // 비밀번호 업데이트
    await prisma.tutor.update({
      where: { id: Number(id) },
      data: { password: hashedNewPassword },
    });

    res.json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("비밀번호 변경 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // JWT 토큰에서 튜터 ID 추출
    const tutorId = (req as any).user?.tutorId;

    if (!tutorId) {
      res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
      } as ApiResponse);
      return;
    }

    // 현재 날짜 기준으로 계산
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    console.log("통계 계산 - 날짜 범위:", {
      tutorId,
      now: now.toISOString(),
      startOfWeek: startOfWeek.toISOString(),
      endOfWeek: endOfWeek.toISOString(),
      startOfMonth: startOfMonth.toISOString(),
    });

    // 총 학생 수
    const totalStudents = await prisma.student.count({
      where: { tutorId },
    });

    // 이번 달 증가 학생 수 (임시로 0으로 설정)
    const newStudentsThisMonth = 0;

    // 이번 주 완료된 수업 수
    const completedLessonsThisWeek = await prisma.lesson.count({
      where: {
        student: { tutorId },
        status: "COMPLETED",
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    // 이번 주 예정 수업 수
    const scheduledLessonsThisWeek = await prisma.lesson.count({
      where: {
        student: { tutorId },
        status: "SCHEDULED",
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    // 이번 주 총 수업 수 (완료 + 예정)
    const totalLessonsThisWeek =
      completedLessonsThisWeek + scheduledLessonsThisWeek;

    console.log("이번 주 수업 통계:", {
      completedLessonsThisWeek,
      scheduledLessonsThisWeek,
      totalLessonsThisWeek,
    });

    // 이번 달 완료된 수업 수
    const completedLessonsThisMonth = await prisma.lesson.count({
      where: {
        student: { tutorId },
        status: "COMPLETED",
        date: {
          gte: startOfMonth,
          lte: now,
        },
      },
    });

    // 이번 달 총 수업 수
    const totalLessonsThisMonth = await prisma.lesson.count({
      where: {
        student: { tutorId },
        date: {
          gte: startOfMonth,
          lte: now,
        },
      },
    });

    // 지난 달 완료된 수업 수
    const completedLessonsLastMonth = await prisma.lesson.count({
      where: {
        student: { tutorId },
        status: "COMPLETED",
        date: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // 지난 달 총 수업 수
    const totalLessonsLastMonth = await prisma.lesson.count({
      where: {
        student: { tutorId },
        date: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // 완료율 계산
    const completionRateThisMonth =
      totalLessonsThisMonth > 0
        ? Math.round((completedLessonsThisMonth / totalLessonsThisMonth) * 100)
        : 0;

    const completionRateLastMonth =
      totalLessonsLastMonth > 0
        ? Math.round((completedLessonsLastMonth / totalLessonsLastMonth) * 100)
        : 0;

    const completionRateChange =
      completionRateThisMonth - completionRateLastMonth;

    res.json({
      success: true,
      data: {
        totalStudents,
        newStudentsThisMonth,
        completedLessonsThisWeek,
        scheduledLessonsThisWeek,
        totalLessonsThisWeek, // 이번 주 총 수업 수 추가
        completionRateThisMonth,
        completionRateChange,
        completedLessonsThisMonth,
        totalLessonsThisMonth,
        completedLessonsLastMonth,
        totalLessonsLastMonth,
      },
      message: "통계 조회가 성공했습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("통계 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};
