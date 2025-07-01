import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

// Swagger 설정 import
import { specs } from "./config/swagger";

// 라우터 import
import tutorRoutes from "./routes/tutorRoutes";
import studentRoutes from "./routes/studentRoutes";
import lessonRoutes from "./routes/lessonRoutes";
import reportRoutes from "./routes/reportRoutes";
import assignmentRoutes from "./routes/assignmentRoutes";
import notificationRoutes from "./routes/notificationRoutes";

// 환경 변수 로드
dotenv.config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI 설정
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Tutor Pocket API Documentation",
  })
);

// 라우터 설정
app.use("/api/tutors", tutorRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/notifications", notificationRoutes);

// 기본 라우트
app.get("/", (req, res) => {
  res.json({
    message: "Tutor Pocket API",
    version: "1.0.0",
    status: "running",
    docs: "http://localhost:3000/api-docs",
  });
});

// 404 핸들러 - 모든 경로에 대해 매칭
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "요청한 리소스를 찾을 수 없습니다.",
  });
});

// 에러 핸들러
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("서버 오류:", err);
    res.status(500).json({
      success: false,
      error: "서버 내부 오류가 발생했습니다.",
    });
  }
);

export default app;
