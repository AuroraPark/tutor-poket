import {
  hashPassword,
  comparePassword,
  validatePassword,
} from "../utils/passwordUtils";

describe("Password Utils", () => {
  describe("hashPassword", () => {
    it("should hash password successfully", async () => {
      const plainPassword = "TestPassword123!";
      const hashedPassword = await hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword).toMatch(/^\$2b\$12\$/); // bcrypt 해시 형식 확인
    });

    it("should generate different hashes for same password", async () => {
      const plainPassword = "TestPassword123!";
      const hash1 = await hashPassword(plainPassword);
      const hash2 = await hashPassword(plainPassword);

      expect(hash1).not.toBe(hash2); // Salt로 인해 다른 해시 생성
    });

    it("should throw error for empty password", async () => {
      await expect(hashPassword("")).rejects.toThrow(
        "비밀번호 해시화에 실패했습니다"
      );
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching password", async () => {
      const plainPassword = "TestPassword123!";
      const hashedPassword = await hashPassword(plainPassword);

      const result = await comparePassword(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it("should return false for non-matching password", async () => {
      const plainPassword = "TestPassword123!";
      const wrongPassword = "WrongPassword123!";
      const hashedPassword = await hashPassword(plainPassword);

      const result = await comparePassword(wrongPassword, hashedPassword);
      expect(result).toBe(false);
    });

    it("should return false for invalid hash", async () => {
      const result = await comparePassword("TestPassword123!", "invalid-hash");
      expect(result).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("should validate strong password", () => {
      const strongPasswords = [
        "SecurePass123!",
        "MyPassword456@",
        "Test123!@#",
        "Abc123!",
      ];

      strongPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.message).toBeUndefined();
      });
    });

    it("should reject password shorter than 8 characters", () => {
      const weakPasswords = ["123", "abc", "Test1!", "Pass12"];

      weakPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.message).toContain("비밀번호는 최소 8자 이상");
      });
    });

    it("should reject password longer than 128 characters", () => {
      const longPassword = "a".repeat(129);
      const result = validatePassword(longPassword);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain("비밀번호는 최대 128자까지");
    });

    it("should reject password with insufficient character types", () => {
      const weakPasswords = [
        "onlyletters", // 영문만
        "123456789", // 숫자만
        "!@#$%^&*()", // 특수문자만
      ];

      weakPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.message).toContain(
          "영문, 숫자, 특수문자 중 최소 2가지 조합"
        );
      });
    });

    it("should accept password with at least 2 character types", () => {
      const validPasswords = [
        "letters123", // 영문+숫자
        "letters!@#", // 영문+특수문자
        "123!@#", // 숫자+특수문자
        "Letters123!@#", // 영문+숫자+특수문자
      ];

      validPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.message).toBeUndefined();
      });
    });
  });
});
