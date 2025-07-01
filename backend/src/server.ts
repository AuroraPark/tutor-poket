import app from "./app";
import prisma from "./lib/prisma";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Prisma 클라이언트 연결 확인
    await prisma.$connect();
    console.log("✅ 데이터베이스 연결 성공");

    // 서버 시작
    app.listen(PORT, () => {
      console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`📖 API 문서: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ 서버 시작 실패:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 서버 종료 중...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 서버 종료 중...");
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
