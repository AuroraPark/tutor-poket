import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tutor Pocket API",
      version: "1.0.0",
      description: "튜터링 관리 시스템 API 문서",
      contact: {
        name: "API Support",
        email: "support@tutorpocket.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "개발 서버",
      },
    ],
    components: {
      schemas: {
        Tutor: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "튜터 ID",
            },
            name: {
              type: "string",
              description: "튜터 이름",
            },
            email: {
              type: "string",
              description: "튜터 이메일",
            },
          },
        },
        Student: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "학생 ID",
            },
            name: {
              type: "string",
              description: "학생 이름",
            },
            subject: {
              type: "string",
              description: "과목",
            },
            contact: {
              type: "string",
              description: "연락처",
            },
            memo: {
              type: "string",
              description: "메모",
            },
            tutorId: {
              type: "integer",
              description: "담당 튜터 ID",
            },
          },
        },
        Lesson: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "강의 ID",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "강의 날짜",
            },
            topic: {
              type: "string",
              description: "강의 주제",
            },
            status: {
              type: "string",
              enum: ["SCHEDULED", "COMPLETED", "CANCELED"],
              description: "강의 상태",
            },
            studentId: {
              type: "integer",
              description: "학생 ID",
            },
          },
        },
        Report: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "리포트 ID",
            },
            content: {
              type: "string",
              description: "과외 피드백 내용",
            },
            lessonId: {
              type: "integer",
              description: "강의 ID",
            },
            lesson: {
              $ref: "#/components/schemas/Lesson",
            },
            assignments: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Assignment",
              },
            },
          },
        },
        Assignment: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "과제 ID",
            },
            title: {
              type: "string",
              description: "과제 제목",
            },
            content: {
              type: "string",
              description: "숙제 내용",
            },
            status: {
              type: "string",
              enum: ["PENDING", "SUBMITTED", "REVIEWED"],
              description: "과제 상태",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "제출 기한",
            },
            attachment: {
              type: "string",
              description: "첨부자료 (파일 경로 또는 URL)",
            },
            reportId: {
              type: "integer",
              description: "리포트 ID",
            },
            report: {
              $ref: "#/components/schemas/Report",
            },
          },
        },
        Notification: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "알림 ID",
            },
            type: {
              type: "string",
              enum: [
                "LESSON_REMINDER",
                "REPORT_READY",
                "ASSIGNMENT_DUE",
                "GENERAL",
              ],
              description: "알림 타입",
            },
            title: {
              type: "string",
              description: "알림 제목",
            },
            message: {
              type: "string",
              description: "알림 내용",
            },
            isRead: {
              type: "boolean",
              description: "읽음 여부",
            },
            lessonId: {
              type: "integer",
              description: "관련 강의 ID",
            },
            reportId: {
              type: "integer",
              description: "관련 리포트 ID",
            },
            tutorId: {
              type: "integer",
              description: "튜터 ID",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "생성 시간",
            },
            lesson: {
              $ref: "#/components/schemas/Lesson",
            },
            report: {
              $ref: "#/components/schemas/Report",
            },
            tutor: {
              $ref: "#/components/schemas/Tutor",
            },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "요청 성공 여부",
            },
            data: {
              type: "object",
              description: "응답 데이터",
            },
            message: {
              type: "string",
              description: "응답 메시지",
            },
            error: {
              type: "string",
              description: "에러 메시지",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // API 라우트 파일 경로
};

export const specs = swaggerJsdoc(options);
