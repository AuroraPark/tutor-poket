import bcrypt from "bcrypt";

const SALT_ROUNDS = 12; // 해시 강도 (기본값: 12)

/**
 * 비밀번호를 해시화합니다.
 * @param plainPassword 평문 비밀번호
 * @returns 해시화된 비밀번호
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    if (!plainPassword || plainPassword.trim() === "") {
      throw new Error("비밀번호가 비어있습니다.");
    }

    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error("비밀번호 해시화 오류:", error);
    throw new Error("비밀번호 해시화에 실패했습니다.");
  }
};

/**
 * 평문 비밀번호와 해시화된 비밀번호를 비교합니다.
 * @param plainPassword 평문 비밀번호
 * @param hashedPassword 해시화된 비밀번호
 * @returns 일치 여부
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("비밀번호 비교 오류:", error);
    return false;
  }
};

/**
 * 비밀번호 유효성을 검사합니다.
 * @param password 검사할 비밀번호
 * @returns 유효성 검사 결과
 */
export const validatePassword = (
  password: string
): { isValid: boolean; message?: string } => {
  // 최소 8자, 최대 128자
  if (password.length < 8) {
    return {
      isValid: false,
      message: "비밀번호는 최소 8자 이상이어야 합니다.",
    };
  }

  if (password.length > 128) {
    return { isValid: false, message: "비밀번호는 최대 128자까지 가능합니다." };
  }

  // 영문, 숫자, 특수문자 중 최소 2가지 조합
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const combinations = [hasLetter, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  if (combinations < 2) {
    return {
      isValid: false,
      message:
        "비밀번호는 영문, 숫자, 특수문자 중 최소 2가지 조합이어야 합니다.",
    };
  }

  return { isValid: true };
};
