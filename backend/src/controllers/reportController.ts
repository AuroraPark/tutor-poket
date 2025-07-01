import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateReportRequest, ApiResponse } from "../types";
import { createReportReadyNotification } from "./notificationController";

export const getReports = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.query;

    const reports = await prisma.report.findMany({
      where: lessonId ? { lessonId: Number(lessonId) } : {},
      include: {
        lesson: {
          include: {
            student: {
              select: {
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
              },
            },
          },
        },
        assignments: true,
      },
      orderBy: { id: "desc" },
    });

    res.json({
      success: true,
      data: reports,
    } as ApiResponse);
  } catch (error) {
    console.error("리포트 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    const { content, lessonId }: CreateReportRequest = req.body;

    // 강의 존재 확인
    const lesson = await prisma.lesson.findUnique({
      where: { id: Number(lessonId) },
      include: {
        student: {
          select: {
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
          },
        },
      },
    });

    if (!lesson) {
      return res.status(400).json({
        success: false,
        error: "존재하지 않는 강의입니다.",
      } as ApiResponse);
    }

    // 이미 리포트가 있는지 확인
    const existingReport = await prisma.report.findUnique({
      where: { lessonId: Number(lessonId) },
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
        lessonId: Number(lessonId),
      },
      include: {
        lesson: {
          include: {
            student: {
              select: {
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
              },
            },
          },
        },
      },
    });

    // 리포트 준비 완료 알림 생성
    try {
      await createReportReadyNotification(report.id, lesson.student.tutor.id);
    } catch (notificationError) {
      console.error("리포트 준비 알림 생성 실패:", notificationError);
      // 알림 생성 실패는 리포트 생성에 영향을 주지 않음
    }

    res.status(201).json({
      success: true,
      data: report,
      message: "리포트가 성공적으로 생성되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("리포트 생성 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            student: {
              select: {
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
              },
            },
          },
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

    res.json({
      success: true,
      data: report,
    } as ApiResponse);
  } catch (error) {
    console.error("리포트 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
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
          include: {
            student: {
              select: {
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
              },
            },
          },
        },
        assignments: {
          orderBy: { id: "desc" },
        },
      },
    });

    res.json({
      success: true,
      data: report,
      message: "리포트가 성공적으로 업데이트되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("리포트 업데이트 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

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

    res.json({
      success: true,
      message: "리포트가 성공적으로 삭제되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("리포트 삭제 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};
