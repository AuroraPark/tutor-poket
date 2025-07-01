import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function hashExistingPasswords() {
  try {
    console.log("기존 비밀번호 해시화를 시작합니다...");

    // 모든 튜터 조회
    const tutors = await prisma.tutor.findMany({
      select: {
        id: true,
        password: true,
      },
    });

    console.log(`${tutors.length}명의 튜터를 찾았습니다.`);

    for (const tutor of tutors) {
      // 이미 해시화된 비밀번호인지 확인 (bcrypt 해시는 $2b$로 시작)
      if (tutor.password.startsWith("$2b$")) {
        console.log(`튜터 ID ${tutor.id}: 이미 해시화된 비밀번호입니다.`);
        continue;
      }

      // 비밀번호 해시화
      const hashedPassword = await bcrypt.hash(tutor.password, SALT_ROUNDS);

      // 데이터베이스 업데이트
      await prisma.tutor.update({
        where: { id: tutor.id },
        data: { password: hashedPassword },
      });

      console.log(`튜터 ID ${tutor.id}: 비밀번호가 해시화되었습니다.`);
    }

    console.log("모든 비밀번호 해시화가 완료되었습니다.");
  } catch (error) {
    console.error("비밀번호 해시화 중 오류 발생:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
if (require.main === module) {
  hashExistingPasswords();
}

export default hashExistingPasswords;
