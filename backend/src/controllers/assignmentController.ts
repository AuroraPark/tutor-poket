import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateAssignmentRequest, ApiResponse } from "../types";

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const { reportId, status } = req.query;

    const where: any = {};
    if (reportId) where.reportId = Number(reportId);
    if (status) where.status = status;

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        report: {
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
        },
      },
      orderBy: { id: "desc" },
    });

    res.json({
      success: true,
      data: assignments,
    } as ApiResponse);
  } catch (error) {
    console.error("과제 목록 조회 오류:", error);
    res.status(500).json({
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

    // 리포트 존재 확인
    const report = await prisma.report.findUnique({
      where: { id: Number(reportId) },
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
        reportId: Number(reportId),
        status: status || "PENDING",
      },
      include: {
        report: {
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
        },
      },
    });

    res.status(201).json({
      success: true,
      data: assignment,
      message: "과제가 성공적으로 생성되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("과제 생성 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        report: {
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
        },
      },
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: "과제를 찾을 수 없습니다.",
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: assignment,
    } as ApiResponse);
  } catch (error) {
    console.error("과제 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
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
      include: {
        report: {
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
        },
      },
    });

    res.json({
      success: true,
      data: assignment,
      message: "과제가 성공적으로 업데이트되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("과제 업데이트 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const updateAssignmentStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
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
      include: {
        report: {
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
        },
      },
    });

    res.json({
      success: true,
      data: assignment,
      message: "과제 상태가 성공적으로 업데이트되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("과제 상태 업데이트 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

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

    res.json({
      success: true,
      message: "과제가 성공적으로 삭제되었습니다.",
    } as ApiResponse);
  } catch (error) {
    console.error("과제 삭제 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    } as ApiResponse);
  }
};
