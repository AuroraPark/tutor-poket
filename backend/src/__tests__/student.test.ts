import request from "supertest";
import app from "../app";
import { createTestTutor, createTestStudent } from "./helpers/testHelpers";

describe("Student API", () => {
  let tutor: any;

  beforeEach(async () => {
    tutor = await createTestTutor();
  });

  describe("POST /api/students", () => {
    it("should create a new student successfully", async () => {
      const studentData = {
        name: "김학생",
        subject: "수학",
        contact: "010-1234-5678",
        memo: "열심히 하는 학생입니다.",
        tutorId: tutor.id,
      };

      const response = await request(app)
        .post("/api/students")
        .send(studentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(studentData.name);
      expect(response.body.data.subject).toBe(studentData.subject);
      expect(response.body.data.tutorId).toBe(tutor.id);
    });

    it("should reject student creation with non-existent tutor", async () => {
      const studentData = {
        name: "김학생",
        subject: "수학",
        tutorId: 99999, // 존재하지 않는 튜터 ID
      };

      const response = await request(app)
        .post("/api/students")
        .send(studentData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("존재하지 않는 튜터");
    });
  });

  describe("GET /api/students", () => {
    it("should return all students", async () => {
      // 테스트 학생들 생성
      await createTestStudent(tutor.id, { name: "학생1", subject: "수학" });
      await createTestStudent(tutor.id, { name: "학생2", subject: "영어" });

      const response = await request(app).get("/api/students").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it("should filter students by tutorId", async () => {
      const tutor2 = await createTestTutor({ email: "tutor2@example.com" });

      // 첫 번째 튜터의 학생
      await createTestStudent(tutor.id, { name: "학생1", subject: "수학" });
      // 두 번째 튜터의 학생
      await createTestStudent(tutor2.id, { name: "학생2", subject: "영어" });

      const response = await request(app)
        .get(`/api/students?tutorId=${tutor.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe("학생1");
    });
  });

  describe("GET /api/students/:id", () => {
    it("should return a specific student", async () => {
      const student = await createTestStudent(tutor.id, {
        name: "특정 학생",
        subject: "과학",
      });

      const response = await request(app)
        .get(`/api/students/${student.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(student.id);
      expect(response.body.data.name).toBe("특정 학생");
    });

    it("should return 404 for non-existent student", async () => {
      const response = await request(app)
        .get("/api/students/99999")
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("학생을 찾을 수 없습니다");
    });
  });

  describe("PUT /api/students/:id", () => {
    it("should update student successfully", async () => {
      const student = await createTestStudent(tutor.id, {
        name: "원래 이름",
        subject: "수학",
      });

      const updateData = {
        name: "변경된 이름",
        subject: "영어",
        contact: "010-9876-5432",
        memo: "업데이트된 메모",
      };

      const response = await request(app)
        .put(`/api/students/${student.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.subject).toBe(updateData.subject);
    });

    it("should return 404 for non-existent student", async () => {
      const response = await request(app)
        .put("/api/students/99999")
        .send({ name: "변경된 이름" })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("학생을 찾을 수 없습니다");
    });
  });

  describe("DELETE /api/students/:id", () => {
    it("should delete student successfully", async () => {
      const student = await createTestStudent(tutor.id, {
        name: "삭제될 학생",
        subject: "수학",
      });

      const response = await request(app)
        .delete(`/api/students/${student.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain(
        "학생이 성공적으로 삭제되었습니다"
      );
    });

    it("should return 404 for non-existent student", async () => {
      const response = await request(app)
        .delete("/api/students/99999")
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("학생을 찾을 수 없습니다");
    });
  });
});
