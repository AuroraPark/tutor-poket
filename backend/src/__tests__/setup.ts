import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// 환경 변수 로드
dotenv.config({ path: ".env.test" });

// 테스트용 Prisma 클라이언트
export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "file:./test.db",
    },
  },
});

// 테스트 전후 정리
beforeAll(async () => {
  // 테스트 데이터베이스 초기화
  await testPrisma.$connect();
});

afterAll(async () => {
  // 모든 테스트 완료 후 연결 종료
  await testPrisma.$disconnect();
});

// 각 테스트 후 데이터 정리
afterEach(async () => {
  // 테이블 순서 주의 (외래키 제약조건)
  await testPrisma.notification.deleteMany();
  await testPrisma.assignment.deleteMany();
  await testPrisma.report.deleteMany();
  await testPrisma.lesson.deleteMany();
  await testPrisma.student.deleteMany();
  await testPrisma.tutor.deleteMany();
});
