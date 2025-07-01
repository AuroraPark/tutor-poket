import request from "supertest";
import app from "../app";
import { createTestTutor, testPrisma } from "./helpers/testHelpers";

describe("Tutor API", () => {
  describe("POST /api/tutors/register", () => {
    it("should create a new tutor successfully", async () => {
      const tutorData = {
        name: "김튜터",
        email: "kim@example.com",
        password: "SecurePass123!",
      };

      const response = await request(app)
        .post("/api/tutors/register")
        .send(tutorData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(tutorData.name);
      expect(response.body.data.email).toBe(tutorData.email);
      expect(response.body.data.password).toBeUndefined(); // 비밀번호는 응답에 포함되지 않아야 함
    });

    it("should reject duplicate email", async () => {
      const tutorData = {
        name: "김튜터",
        email: "duplicate@example.com",
        password: "SecurePass123!",
      };

      // 첫 번째 튜터 생성
      await request(app)
        .post("/api/tutors/register")
        .send(tutorData)
        .expect(201);

      // 중복 이메일로 두 번째 튜터 생성 시도
      const response = await request(app)
        .post("/api/tutors/register")
        .send(tutorData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("이미 존재하는 이메일");
    });

    it("should reject weak password", async () => {
      const tutorData = {
        name: "김튜터",
        email: "weak@example.com",
        password: "123", // 약한 비밀번호
      };

      const response = await request(app)
        .post("/api/tutors/register")
        .send(tutorData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("비밀번호는 최소 8자 이상");
    });
  });

  describe("POST /api/tutors/login", () => {
    it("should login successfully with correct credentials", async () => {
      const tutorData = {
        name: "로그인 테스트",
        email: "login@example.com",
        password: "LoginPass123!",
      };

      // 튜터 생성
      await createTestTutor(tutorData);

      // 로그인
      const response = await request(app)
        .post("/api/tutors/login")
        .send({
          email: tutorData.email,
          password: tutorData.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(tutorData.email);
      expect(response.body.data.password).toBeUndefined();
    });

    it("should reject login with wrong password", async () => {
      const tutorData = {
        name: "로그인 테스트",
        email: "wrongpass@example.com",
        password: "CorrectPass123!",
      };

      // 튜터 생성
      await createTestTutor(tutorData);

      // 잘못된 비밀번호로 로그인 시도
      const response = await request(app)
        .post("/api/tutors/login")
        .send({
          email: tutorData.email,
          password: "WrongPass123!",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain(
        "이메일 또는 비밀번호가 올바르지 않습니다"
      );
    });

    it("should reject login with non-existent email", async () => {
      const response = await request(app)
        .post("/api/tutors/login")
        .send({
          email: "nonexistent@example.com",
          password: "AnyPass123!",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain(
        "이메일 또는 비밀번호가 올바르지 않습니다"
      );
    });
  });

  describe("GET /api/tutors", () => {
    it("should return all tutors without passwords", async () => {
      // 테스트 튜터들 생성
      await createTestTutor({ name: "튜터1", email: "tutor1@example.com" });
      await createTestTutor({ name: "튜터2", email: "tutor2@example.com" });

      const response = await request(app).get("/api/tutors").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].password).toBeUndefined();
      expect(response.body.data[1].password).toBeUndefined();
    });
  });

  describe("PATCH /api/tutors/:id/change-password", () => {
    it("should change password successfully", async () => {
      const tutor = await createTestTutor({
        name: "비밀번호 변경 테스트",
        email: "changepass@example.com",
        password: "OldPass123!",
      });

      const response = await request(app)
        .patch(`/api/tutors/${tutor.id}/change-password`)
        .send({
          currentPassword: "OldPass123!",
          newPassword: "NewPass456!",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain(
        "비밀번호가 성공적으로 변경되었습니다"
      );
    });

    it("should reject password change with wrong current password", async () => {
      const tutor = await createTestTutor({
        name: "비밀번호 변경 테스트",
        email: "wrongcurrent@example.com",
        password: "CorrectPass123!",
      });

      const response = await request(app)
        .patch(`/api/tutors/${tutor.id}/change-password`)
        .send({
          currentPassword: "WrongPass123!",
          newPassword: "NewPass456!",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain(
        "현재 비밀번호가 올바르지 않습니다"
      );
    });

    it("should reject weak new password", async () => {
      const tutor = await createTestTutor({
        name: "비밀번호 변경 테스트",
        email: "weaknew@example.com",
        password: "OldPass123!",
      });

      const response = await request(app)
        .patch(`/api/tutors/${tutor.id}/change-password`)
        .send({
          currentPassword: "OldPass123!",
          newPassword: "123", // 약한 비밀번호
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("비밀번호는 최소 8자 이상");
    });
  });
});
