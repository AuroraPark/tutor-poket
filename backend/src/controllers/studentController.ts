import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateStudentRequest, ApiResponse } from "../types";

// 공통 tutor select 상수 정의
const tutorSelect = {
  id: true,
  name: true,
  email: true,
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        lessons: true,
        tutor: { select: tutorSelect },
      },
    });

    return res.json({
      success: true,
      data: students,
    } as ApiResponse);
  } catch (error) {
    console.error("[getStudents] 학생 목록 조회 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, subject, tutorId, contact, memo }: CreateStudentRequest =
      req.body;
    const tutorIdNum = Number(tutorId);
    if (!tutorId || isNaN(tutorIdNum)) {
      return res.status(400).json({
        success: false,
        error: "tutorId가 올바르지 않습니다.",
      } as ApiResponse);
    }

    // 튜터 존재 확인
    const tutor = await prisma.tutor.findUnique({
      where: { id: tutorIdNum },
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
        tutorId: tutorIdNum,
      },
      include: {
        tutor: { select: tutorSelect },
      },
    });

    return res.status(201).json({
      success: true,
      data: student,
      message: "학생이 성공적으로 등록되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("[createStudent] 학생 등록 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "id가 올바르지 않습니다.",
      } as ApiResponse);
    }

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        lessons: { orderBy: { date: "desc" } },
        tutor: { select: tutorSelect },
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "학생을 찾을 수 없습니다.",
      } as ApiResponse);
    }

    return res.json({
      success: true,
      data: student,
    } as ApiResponse);
  } catch (error) {
    console.error("[getStudentById] 학생 조회 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const getStudentLessons = async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.params.studentId);
    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        error: "studentId가 올바르지 않습니다.",
      } as ApiResponse);
    }

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
        report: { include: { assignments: true } },
      },
      orderBy: { date: "desc" },
    });

    return res.json({
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
    console.error("[getStudentLessons] 학생별 수업 조회 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "id가 올바르지 않습니다.",
      } as ApiResponse);
    }
    const { name, subject, tutorId, contact, memo } = req.body;

    // 학생 존재 확인
    const existingStudent = await prisma.student.findUnique({ where: { id } });
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        error: "학생을 찾을 수 없습니다.",
      } as ApiResponse);
    }

    // 튜터 존재 확인 (튜터가 변경되는 경우)
    let tutorIdNum: number | undefined = undefined;
    if (tutorId) {
      tutorIdNum = Number(tutorId);
      if (isNaN(tutorIdNum)) {
        return res.status(400).json({
          success: false,
          error: "tutorId가 올바르지 않습니다.",
        } as ApiResponse);
      }
      const tutor = await prisma.tutor.findUnique({
        where: { id: tutorIdNum },
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
        tutorId: tutorIdNum,
      },
      include: {
        tutor: { select: tutorSelect },
      },
    });

    return res.json({
      success: true,
      data: student,
      message: "학생 정보가 성공적으로 업데이트되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("[updateStudent] 학생 업데이트 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "id가 올바르지 않습니다.",
      } as ApiResponse);
    }

    // 학생 존재 확인
    const existingStudent = await prisma.student.findUnique({ where: { id } });
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        error: "학생을 찾을 수 없습니다.",
      } as ApiResponse);
    }

    // 학생 삭제 (관련된 수업들도 함께 삭제됨 - CASCADE 설정에 따라)
    await prisma.student.delete({ where: { id } });

    return res.json({
      success: true,
      message: "학생이 성공적으로 삭제되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("[deleteStudent] 학생 삭제 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};
