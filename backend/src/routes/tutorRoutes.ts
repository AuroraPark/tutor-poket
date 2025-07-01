import { Router } from "express";
import {
  createTutor,
  login,
  getTutors,
  changePassword,
  getProfile,
  getStats,
} from "../controllers/tutorController";
import { authenticateToken } from "../utils/jwtUtils";

const router = Router();

/**
 * @swagger
 * /api/tutors/register:
 *   post:
 *     summary: 튜터 등록
 *     tags: [Tutors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: 튜터 이름
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 튜터 이메일
 *               password:
 *                 type: string
 *                 description: 비밀번호 (최소 8자, 영문/숫자/특수문자 중 2가지 조합)
 *     responses:
 *       201:
 *         description: 튜터가 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 잘못된 요청, 중복된 이메일, 또는 비밀번호 유효성 검사 실패
 *       500:
 *         description: 서버 오류
 */
router.post("/register", createTutor);

/**
 * @swagger
 * /api/tutors/login:
 *   post:
 *     summary: 튜터 로그인
 *     tags: [Tutors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 튜터 이메일
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
router.post("/login", login);

/**
 * @swagger
 * /api/tutors/profile:
 *   get:
 *     summary: 튜터 프로필 조회
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 프로필 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     students:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           contact:
 *                             type: string
 *                           subject:
 *                             type: string
 *                           memo:
 *                             type: string
 *                           lessons:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                 date:
 *                                   type: string
 *                                   format: date-time
 *                                 topic:
 *                                   type: string
 *                                 status:
 *                                   type: string
 *                                   enum: [SCHEDULED, COMPLETED, CANCELED]
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 튜터를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/profile", authenticateToken, getProfile);

/**
 * @swagger
 * /api/tutors/stats:
 *   get:
 *     summary: 튜터 통계 조회
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 통계 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalStudents:
 *                       type: integer
 *                       description: 총 학생 수
 *                     newStudentsThisMonth:
 *                       type: integer
 *                       description: 이번 달 증가 학생 수
 *                     completedLessonsThisWeek:
 *                       type: integer
 *                       description: 이번 주 완료된 수업 수
 *                     scheduledLessonsThisWeek:
 *                       type: integer
 *                       description: 이번 주 예정 수업 수
 *                     completionRateThisMonth:
 *                       type: integer
 *                       description: 이번 달 완료율 (%)
 *                     completionRateChange:
 *                       type: integer
 *                       description: 지난 달 대비 완료율 변화 (%)
 *                     completedLessonsThisMonth:
 *                       type: integer
 *                       description: 이번 달 완료된 수업 수
 *                     totalLessonsThisMonth:
 *                       type: integer
 *                       description: 이번 달 총 수업 수
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 서버 오류
 */
router.get("/stats", authenticateToken, getStats);

/**
 * @swagger
 * /api/tutors:
 *   get:
 *     summary: 튜터 목록 조회
 *     tags: [Tutors]
 *     responses:
 *       200:
 *         description: 튜터 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tutor'
 *       500:
 *         description: 서버 오류
 */
router.get("/", getTutors);

/**
 * @swagger
 * /api/tutors/{id}/change-password:
 *   patch:
 *     summary: 비밀번호 변경
 *     tags: [Tutors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 튜터 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: 현재 비밀번호
 *               newPassword:
 *                 type: string
 *                 description: 새 비밀번호 (최소 8자, 영문/숫자/특수문자 중 2가지 조합)
 *     responses:
 *       200:
 *         description: 비밀번호 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 현재 비밀번호 오류 또는 새 비밀번호 유효성 검사 실패
 *       404:
 *         description: 튜터를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.patch("/:id/change-password", changePassword);

export default router;
