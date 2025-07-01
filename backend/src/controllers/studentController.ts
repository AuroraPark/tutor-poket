import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateStudentRequest, ApiResponse } from "../types";

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        lessons: true,
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
      data: students,
    } as ApiResponse);
  } catch (error) {
    console.error("학생 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, subject, tutorId, contact, memo }: CreateStudentRequest =
      req.body;

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

    const student = await prisma.student.create({
      data: {
        name,
        subject,
        contact,
        memo,
        tutorId: Number(tutorId),
      },
      include: {
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
      data: student,
      message: "학생이 성공적으로 등록되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("학생 등록 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { date: "desc" },
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

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "학생을 찾을 수 없습니다.",
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: student,
    } as ApiResponse);
  } catch (error) {
    console.error("학생 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const getStudentLessons = async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.params.studentId);

    // 학생 존재 확인
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "학생을 찾을 수 없습니다.",
      } as ApiResponse);
    }

    // 학생의 수업 목록 조회
    const lessons = await prisma.lesson.findMany({
      where: { studentId },
      include: {
        report: {
          include: {
            assignments: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    res.json({
      success: true,
      data: {
        student: {
          id: student.id,
          name: student.name,
          subject: student.subject,
          contact: student.contact,
          memo: student.memo,
        },
        lessons,
      },
      message: "학생별 수업 목록 조회가 성공했습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("학생별 수업 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, subject, tutorId, contact, memo } = req.body;

    // 학생 존재 확인
    const existingStudent = await prisma.student.findUnique({
      where: { id },
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        error: "학생을 찾을 수 없습니다.",
      } as ApiResponse);
    }

    // 튜터 존재 확인 (튜터가 변경되는 경우)
    if (tutorId) {
      const tutor = await prisma.tutor.findUnique({
        where: { id: Number(tutorId) },
      });

      if (!tutor) {
        return res.status(400).json({
          success: false,
          error: "존재하지 않는 튜터입니다.",
        } as ApiResponse);
      }
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        name,
        subject,
        contact,
        memo,
        tutorId: tutorId ? Number(tutorId) : undefined,
      },
      include: {
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
      data: student,
      message: "학생 정보가 성공적으로 업데이트되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("학생 업데이트 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // 학생 존재 확인
    const existingStudent = await prisma.student.findUnique({
      where: { id },
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        error: "학생을 찾을 수 없습니다.",
      } as ApiResponse);
    }

    // 학생 삭제 (관련된 수업들도 함께 삭제됨 - CASCADE 설정에 따라)
    await prisma.student.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "학생이 성공적으로 삭제되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("학생 삭제 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};
