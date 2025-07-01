import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../utils/passwordUtils";

export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./test.db",
    },
  },
});

// 테스트용 튜터 데이터 생성
export const createTestTutor = async (data?: {
  name?: string;
  email?: string;
  password?: string;
}) => {
  const hashedPassword = await hashPassword(data?.password || "TestPass123!");

  return await testPrisma.tutor.create({
    data: {
      name: data?.name || "테스트 튜터",
      email: data?.email || "test@example.com",
      password: hashedPassword,
    },
  });
};

// 테스트용 학생 데이터 생성
export const createTestStudent = async (
  tutorId: number,
  data?: {
    name?: string;
    subject?: string;
    contact?: string;
    memo?: string;
  }
) => {
  return await testPrisma.student.create({
    data: {
      name: data?.name || "테스트 학생",
      subject: data?.subject || "수학",
      contact: data?.contact || "010-1234-5678",
      memo: data?.memo || "테스트 메모",
      tutorId,
    },
  });
};

// 테스트용 강의 데이터 생성
export const createTestLesson = async (
  studentId: number,
  data?: {
    date?: Date;
    topic?: string;
    status?: "SCHEDULED" | "COMPLETED" | "CANCELED";
  }
) => {
  return await testPrisma.lesson.create({
    data: {
      date: data?.date || new Date(),
      topic: data?.topic || "테스트 강의",
      status: data?.status || "SCHEDULED",
      studentId,
    },
  });
};

// 테스트용 리포트 데이터 생성
export const createTestReport = async (
  lessonId: number,
  data?: {
    content?: string;
  }
) => {
  return await testPrisma.report.create({
    data: {
      content: data?.content || "테스트 리포트 내용",
      lessonId,
    },
  });
};

// 테스트용 과제 데이터 생성
export const createTestAssignment = async (
  reportId: number,
  data?: {
    title?: string;
    content?: string;
    status?: "PENDING" | "SUBMITTED" | "REVIEWED";
    dueDate?: Date;
    attachment?: string;
  }
) => {
  return await testPrisma.assignment.create({
    data: {
      title: data?.title || "테스트 과제",
      content: data?.content || "테스트 과제 내용",
      status: data?.status || "PENDING",
      dueDate: data?.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
      attachment: data?.attachment || "/uploads/test.pdf",
      reportId,
    },
  });
};

// 테스트용 알림 데이터 생성
export const createTestNotification = async (
  tutorId: number,
  data?: {
    type?: "LESSON_REMINDER" | "REPORT_READY" | "ASSIGNMENT_DUE" | "GENERAL";
    title?: string;
    message?: string;
    lessonId?: number;
    reportId?: number;
  }
) => {
  return await testPrisma.notification.create({
    data: {
      type: data?.type || "GENERAL",
      title: data?.title || "테스트 알림",
      message: data?.message || "테스트 알림 내용",
      lessonId: data?.lessonId || null,
      reportId: data?.reportId || null,
      tutorId,
    },
  });
};
