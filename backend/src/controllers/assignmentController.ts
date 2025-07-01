import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateAssignmentRequest, ApiResponse } from "../types";

// 공통 select/include 상수 정의
const tutorSelect = {
  id: true,
  name: true,
  email: true,
};
const studentWithTutorSelect = {
  id: true,
  name: true,
  subject: true,
  tutor: { select: tutorSelect },
};
const assignmentReportInclude = {
  report: {
    include: {
      lesson: {
        include: {
          student: { select: studentWithTutorSelect },
        },
      },
    },
  },
};

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const { reportId, status } = req.query;
    const where: any = {};
    if (reportId) {
      const reportIdNum = Number(reportId);
      if (isNaN(reportIdNum)) {
        return res.status(400).json({
          success: false,
          error: "reportId가 올바르지 않습니다.",
        } as ApiResponse);
      }
      where.reportId = reportIdNum;
    }
    if (status) where.status = status;

    const assignments = await prisma.assignment.findMany({
      where,
      include: assignmentReportInclude,
      orderBy: { id: "desc" },
    });

    return res.json({
      success: true,
      data: assignments,
    } as ApiResponse);
  } catch (error) {
    console.error("[getAssignments] 과제 목록 조회 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      dueDate,
      attachment,
      reportId,
      status,
    }: CreateAssignmentRequest = req.body;
    const reportIdNum = Number(reportId);
    if (!reportId || isNaN(reportIdNum)) {
      return res.status(400).json({
        success: false,
        error: "reportId가 올바르지 않습니다.",
      } as ApiResponse);
    }

    // 리포트 존재 확인
    const report = await prisma.report.findUnique({
      where: { id: reportIdNum },
    });
    if (!report) {
      return res.status(400).json({
        success: false,
        error: "존재하지 않는 리포트입니다.",
      } as ApiResponse);
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        content,
        dueDate: dueDate ? new Date(dueDate) : null,
        attachment,
        reportId: reportIdNum,
        status: status || "PENDING",
      },
      include: assignmentReportInclude,
    });

    return res.status(201).json({
      success: true,
      data: assignment,
      message: "과제가 성공적으로 생성되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("[createAssignment] 과제 생성 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "id가 올바르지 않습니다.",
      } as ApiResponse);
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: assignmentReportInclude,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: "과제를 찾을 수 없습니다.",
      } as ApiResponse);
    }

    return res.json({
      success: true,
      data: assignment,
    } as ApiResponse);
  } catch (error) {
    console.error("[getAssignmentById] 과제 조회 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "id가 올바르지 않습니다.",
      } as ApiResponse);
    }
    const { title, content, dueDate, attachment, status } = req.body;

    // 과제 존재 확인
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id },
    });
    if (!existingAssignment) {
      return res.status(404).json({
        success: false,
        error: "과제를 찾을 수 없습니다.",
      } as ApiResponse);
    }

    // 상태값 유효성 검사
    if (status) {
      const validStatuses = ["PENDING", "SUBMITTED", "REVIEWED"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: "유효하지 않은 상태값입니다.",
        } as ApiResponse);
      }
    }

    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        title,
        content,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        attachment,
        status,
      },
      include: assignmentReportInclude,
    });

    return res.json({
      success: true,
      data: assignment,
      message: "과제가 성공적으로 업데이트되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("[updateAssignment] 과제 업데이트 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const updateAssignmentStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "id가 올바르지 않습니다.",
      } as ApiResponse);
    }
    const { status } = req.body;

    // 과제 존재 확인
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id },
    });
    if (!existingAssignment) {
      return res.status(404).json({
        success: false,
        error: "과제를 찾을 수 없습니다.",
      } as ApiResponse);
    }

    // 상태값 유효성 검사
    const validStatuses = ["PENDING", "SUBMITTED", "REVIEWED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "유효하지 않은 상태값입니다.",
      } as ApiResponse);
    }

    const assignment = await prisma.assignment.update({
      where: { id },
      data: { status },
      include: assignmentReportInclude,
    });

    return res.json({
      success: true,
      data: assignment,
      message: "과제 상태가 성공적으로 업데이트되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("[updateAssignmentStatus] 과제 상태 업데이트 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "id가 올바르지 않습니다.",
      } as ApiResponse);
    }

    // 과제 존재 확인
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id },
    });
    if (!existingAssignment) {
      return res.status(404).json({
        success: false,
        error: "과제를 찾을 수 없습니다.",
      } as ApiResponse);
    }

    await prisma.assignment.delete({ where: { id } });

    return res.json({
      success: true,
      message: "과제가 성공적으로 삭제되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("[deleteAssignment] 과제 삭제 오류:", error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};
