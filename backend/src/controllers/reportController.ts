import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateReportRequest, ApiResponse } from "../types";
import { createReportReadyNotification } from "./notificationController";

// 공통 select/include 상수 정의
const studentWithTutorSelect = {
  id: true,
  name: true,
  subject: true,
  tutor: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

const lessonWithStudentInclude = {
  student: {
    select: studentWithTutorSelect,
  },
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const lessonId = req.query.lessonId
      ? Number(req.query.lessonId)
      : undefined;
    if (req.query.lessonId && isNaN(lessonId!)) {
      return res.status(400).json({
        success: false,
        error: "lessonId가 올바르지 않습니다.",
      } as ApiResponse);
    }

    const reports = await prisma.report.findMany({
      where: lessonId ? { lessonId } : {},
      include: {
        lesson: {
          include: lessonWithStudentInclude,
        },
        assignments: true,
      },
      orderBy: { id: "desc" },
    });

    return res.json({
      success: true,
      data: reports,
    } as ApiResponse);
  } catch (error) {
    console.error("[getReports] 리포트 목록 조회 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    const { content, lessonId }: CreateReportRequest = req.body;
    const lessonIdNum = Number(lessonId);
    if (!lessonId || isNaN(lessonIdNum)) {
      return res.status(400).json({
        success: false,
        error: "lessonId가 올바르지 않습니다.",
      } as ApiResponse);
    }

    // 강의 존재 확인
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonIdNum },
      include: lessonWithStudentInclude,
    });

    if (!lesson) {
      return res.status(400).json({
        success: false,
        error: "존재하지 않는 강의입니다.",
      } as ApiResponse);
    }

    // 이미 리포트가 있는지 확인
    const existingReport = await prisma.report.findUnique({
      where: { lessonId: lessonIdNum },
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        error: "이미 해당 강의에 대한 리포트가 존재합니다.",
      } as ApiResponse);
    }

    const report = await prisma.report.create({
      data: {
        content,
        lessonId: lessonIdNum,
      },
      include: {
        lesson: {
          include: lessonWithStudentInclude,
        },
      },
    });

    // 리포트 준비 완료 알림 생성
    try {
      await createReportReadyNotification(report.id, lesson.student.tutor.id);
    } catch (notificationError) {
      console.error(
        "[createReport] 리포트 준비 알림 생성 실패:",
        notificationError
      );
      // 알림 생성 실패는 리포트 생성에 영향 없음
    }

    return res.status(201).json({
      success: true,
      data: report,
      message: "리포트가 성공적으로 생성되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("[createReport] 리포트 생성 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "id가 올바르지 않습니다.",
      } as ApiResponse);
    }

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        lesson: {
          include: lessonWithStudentInclude,
        },
        assignments: {
          orderBy: { id: "desc" },
        },
      },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        error: "리포트를 찾을 수 없습니다.",
      } as ApiResponse);
    }

    return res.json({
      success: true,
      data: report,
    } as ApiResponse);
  } catch (error) {
    console.error("[getReportById] 리포트 조회 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "id가 올바르지 않습니다.",
      } as ApiResponse);
    }
    const { content } = req.body;

    // 리포트 존재 확인
    const existingReport = await prisma.report.findUnique({
      where: { id },
    });

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        error: "리포트를 찾을 수 없습니다.",
      } as ApiResponse);
    }

    const report = await prisma.report.update({
      where: { id },
      data: { content },
      include: {
        lesson: {
          include: lessonWithStudentInclude,
        },
        assignments: {
          orderBy: { id: "desc" },
        },
      },
    });

    return res.json({
      success: true,
      data: report,
      message: "리포트가 성공적으로 업데이트되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("[updateReport] 리포트 업데이트 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "id가 올바르지 않습니다.",
      } as ApiResponse);
    }

    // 리포트 존재 확인
    const existingReport = await prisma.report.findUnique({
      where: { id },
    });

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        error: "리포트를 찾을 수 없습니다.",
      } as ApiResponse);
    }

    await prisma.report.delete({ where: { id } });

    return res.json({
      success: true,
      message: "리포트가 성공적으로 삭제되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("[deleteReport] 리포트 삭제 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};
