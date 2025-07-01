import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateLessonRequest, ApiResponse } from "../types";
import { createLessonReminder } from "./notificationController";

export const getLessons = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.query;

    const lessons = await prisma.lesson.findMany({
      where: studentId ? { studentId: Number(studentId) } : {},
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
        report: {
          include: {
            assignments: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    res.json({
      success: true,
      data: lessons,
    } as ApiResponse);
  } catch (error) {
    console.error("강의 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const createLesson = async (req: Request, res: Response) => {
  try {
    const { date, topic, studentId, status }: CreateLessonRequest = req.body;

    // 학생 존재 확인
    const student = await prisma.student.findUnique({
      where: { id: Number(studentId) },
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        error: "존재하지 않는 학생입니다.",
      } as ApiResponse);
    }

    // 상태값을 대문자로 변환하고 타입 검증
    const lessonStatus = status ? status.toUpperCase() : "SCHEDULED";
    if (!["SCHEDULED", "COMPLETED", "CANCELED"].includes(lessonStatus)) {
      return res.status(400).json({
        success: false,
        error: "유효하지 않은 상태값입니다.",
      } as ApiResponse);
    }

    const lesson = await prisma.lesson.create({
      data: {
        date: new Date(date),
        topic,
        studentId: Number(studentId),
        status: lessonStatus as any,
      },
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

    // 수업 전 리마인드 알림 생성 (수업이 예정된 경우)
    if (lesson.status === "SCHEDULED") {
      try {
        // student 정보를 다시 조회하여 tutor ID 가져오기
        const studentWithTutor = await prisma.student.findUnique({
          where: { id: Number(studentId) },
          include: {
            tutor: {
              select: {
                id: true,
              },
            },
          },
        });

        if (studentWithTutor?.tutor?.id) {
          await createLessonReminder(lesson.id, studentWithTutor.tutor.id);
        }
      } catch (notificationError) {
        console.error("리마인드 알림 생성 실패:", notificationError);
        // 알림 생성 실패는 강의 생성에 영향을 주지 않음
      }
    }

    res.status(201).json({
      success: true,
      data: lesson,
      message: "강의가 성공적으로 생성되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("강의 생성 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const getLessonById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const lesson = await prisma.lesson.findUnique({
      where: { id },
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
        report: {
          include: {
            assignments: true,
          },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: "강의를 찾을 수 없습니다.",
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: lesson,
    } as ApiResponse);
  } catch (error) {
    console.error("강의 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const updateLessonStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    // 강의 존재 확인
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        error: "강의를 찾을 수 없습니다.",
      } as ApiResponse);
    }

    // 상태값 유효성 검사
    const validStatuses = ["SCHEDULED", "COMPLETED", "CANCELED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "유효하지 않은 상태값입니다.",
      } as ApiResponse);
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: { status },
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

    res.json({
      success: true,
      data: updatedLesson,
      message: "강의 상태가 성공적으로 업데이트되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("강의 상태 업데이트 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { date, topic, studentId, status } = req.body;

    // 강의 존재 확인
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        error: "강의를 찾을 수 없습니다.",
      } as ApiResponse);
    }

    // 학생 존재 확인 (학생이 변경되는 경우)
    if (studentId) {
      const student = await prisma.student.findUnique({
        where: { id: Number(studentId) },
      });

      if (!student) {
        return res.status(400).json({
          success: false,
          error: "존재하지 않는 학생입니다.",
        } as ApiResponse);
      }
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        topic,
        studentId: studentId ? Number(studentId) : undefined,
        status,
      },
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

    res.json({
      success: true,
      data: updatedLesson,
      message: "강의 정보가 성공적으로 업데이트되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("강의 업데이트 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // 강의 존재 확인
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        error: "강의를 찾을 수 없습니다.",
      } as ApiResponse);
    }

    await prisma.lesson.delete({ where: { id } });

    res.json({
      success: true,
      message: "강의가 성공적으로 삭제되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("강의 삭제 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};
