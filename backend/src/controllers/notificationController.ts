import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { ApiResponse } from "../types";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { tutorId, type, isRead } = req.query;

    const where: any = {};
    if (tutorId) where.tutorId = Number(tutorId);
    if (type) where.type = type;
    if (isRead !== undefined) where.isRead = isRead === "true";

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        lesson: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                subject: true,
              },
            },
          },
        },
        report: {
          include: {
            lesson: {
              include: {
                student: {
                  select: {
                    id: true,
                    name: true,
                    subject: true,
                  },
                },
              },
            },
          },
        },
        tutor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 날짜가 지난 수업 리마인드 알림 필터링
    const now = new Date();
    const filteredNotifications = notifications.filter((notification) => {
      if (notification.type === "LESSON_REMINDER" && notification.lesson) {
        // 수업 날짜가 지났으면 제외
        return new Date(notification.lesson.date) > now;
      }
      return true;
    });

    res.json({
      success: true,
      data: filteredNotifications,
    } as ApiResponse);
  } catch (error) {
    console.error("알림 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { type, title, message, lessonId, reportId, tutorId } = req.body;

    // 튜터 존재 확인
    const tutor = await prisma.tutor.findUnique({
      where: { id: Number(tutorId) },
    });

    if (!tutor) {
      return res.status(400).json({
        success: false,
        error: "존재하지 않는 튜터입니다.",
      } as ApiResponse);
    }

    // 강의 존재 확인 (lessonId가 제공된 경우)
    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: Number(lessonId) },
      });

      if (!lesson) {
        return res.status(400).json({
          success: false,
          error: "존재하지 않는 강의입니다.",
        } as ApiResponse);
      }
    }

    // 리포트 존재 확인 (reportId가 제공된 경우)
    if (reportId) {
      const report = await prisma.report.findUnique({
        where: { id: Number(reportId) },
      });

      if (!report) {
        return res.status(400).json({
          success: false,
          error: "존재하지 않는 리포트입니다.",
        } as ApiResponse);
      }
    }

    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        lessonId: lessonId ? Number(lessonId) : null,
        reportId: reportId ? Number(reportId) : null,
        tutorId: Number(tutorId),
      },
      include: {
        lesson: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                subject: true,
              },
            },
          },
        },
        report: {
          include: {
            lesson: {
              include: {
                student: {
                  select: {
                    id: true,
                    name: true,
                    subject: true,
                  },
                },
              },
            },
          },
        },
        tutor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: notification,
      message: "알림이 성공적으로 생성되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("알림 생성 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // 알림 존재 확인
    const existingNotification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!existingNotification) {
      return res.status(404).json({
        success: false,
        error: "알림을 찾을 수 없습니다.",
      } as ApiResponse);
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
      include: {
        lesson: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                subject: true,
              },
            },
          },
        },
        report: {
          include: {
            lesson: {
              include: {
                student: {
                  select: {
                    id: true,
                    name: true,
                    subject: true,
                  },
                },
              },
            },
          },
        },
        tutor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: notification,
      message: "알림이 읽음으로 표시되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("알림 읽음 처리 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.query;

    if (!tutorId) {
      return res.status(400).json({
        success: false,
        error: "튜터 ID가 필요합니다.",
      } as ApiResponse);
    }

    await prisma.notification.updateMany({
      where: {
        tutorId: Number(tutorId),
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({
      success: true,
      message: "모든 알림이 읽음으로 표시되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("모든 알림 읽음 처리 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // 알림 존재 확인
    const existingNotification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!existingNotification) {
      return res.status(404).json({
        success: false,
        error: "알림을 찾을 수 없습니다.",
      } as ApiResponse);
    }

    await prisma.notification.delete({ where: { id } });

    res.json({
      success: true,
      message: "알림이 성공적으로 삭제되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("알림 삭제 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

// 수업 전 리마인드 생성 함수
export const createLessonReminder = async (
  lessonId: number,
  tutorId: number
) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        student: {
          select: {
            name: true,
            subject: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new Error("강의를 찾을 수 없습니다.");
    }

    const notification = await prisma.notification.create({
      data: {
        type: "LESSON_REMINDER",
        title: "수업 리마인드",
        message: `${lesson.student.name} 학생의 ${
          lesson.topic
        } 수업이 ${new Date(lesson.date).toLocaleString(
          "ko-KR"
        )}에 예정되어 있습니다.`,
        lessonId,
        tutorId,
      },
    });

    return notification;
  } catch (error) {
    console.error("수업 리마인드 생성 오류:", error);
    throw error;
  }
};

// 리포트 준비 완료 알림 생성 함수
export const createReportReadyNotification = async (
  reportId: number,
  tutorId: number
) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        lesson: {
          include: {
            student: {
              select: {
                name: true,
                subject: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      throw new Error("리포트를 찾을 수 없습니다.");
    }

    const notification = await prisma.notification.create({
      data: {
        type: "REPORT_READY",
        title: "리포트 준비 완료",
        message: `${report.lesson.student.name} 학생의 ${report.lesson.subject} 수업 리포트가 준비되었습니다.`,
        reportId,
        tutorId,
      },
    });

    return notification;
  } catch (error) {
    console.error("리포트 준비 알림 생성 오류:", error);
    throw error;
  }
};
