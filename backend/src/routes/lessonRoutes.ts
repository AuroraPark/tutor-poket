import { Router } from "express";
import {
  getLessons,
  createLesson,
  getLessonById,
  updateLessonStatus,
  updateLesson,
  deleteLesson,
} from "../controllers/lessonController";

const router = Router();

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: 강의 목록 조회
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: integer
 *         description: 특정 학생의 강의만 조회 (선택사항)
 *     responses:
 *       200:
 *         description: 강의 목록 조회 성공
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
 *                     $ref: '#/components/schemas/Lesson'
 *       500:
 *         description: 서버 오류
 */
router.get("/", getLessons);

/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: 강의 생성
 *     tags: [Lessons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - topic
 *               - studentId
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: 강의 날짜
 *               topic:
 *                 type: string
 *                 description: 강의 주제
 *               studentId:
 *                 type: integer
 *                 description: 학생 ID
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, COMPLETED, CANCELED]
 *                 default: SCHEDULED
 *                 description: 강의 상태
 *     responses:
 *       201:
 *         description: 강의가 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 잘못된 요청 또는 존재하지 않는 학생
 *       500:
 *         description: 서버 오류
 */
router.post("/", createLesson);

/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: 특정 강의 조회
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 강의 ID
 *     responses:
 *       200:
 *         description: 강의 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 강의를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/:id", getLessonById);

/**
 * @swagger
 * /api/lessons/{id}/status:
 *   patch:
 *     summary: 강의 상태 변경
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 강의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, COMPLETED, CANCELED]
 *                 description: 새로운 강의 상태
 *     responses:
 *       200:
 *         description: 강의 상태 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 잘못된 상태값
 *       404:
 *         description: 강의를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.patch("/:id/status", updateLessonStatus);

/**
 * @swagger
 * /api/lessons/{id}:
 *   put:
 *     summary: 강의 정보 수정
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 강의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: 강의 날짜
 *               topic:
 *                 type: string
 *                 description: 강의 주제
 *               studentId:
 *                 type: integer
 *                 description: 학생 ID
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, COMPLETED, CANCELED]
 *                 description: 강의 상태
 *     responses:
 *       200:
 *         description: 강의 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 잘못된 요청 또는 존재하지 않는 학생
 *       404:
 *         description: 강의를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/:id", updateLesson);

/**
 * @swagger
 * /api/lessons/{id}:
 *   delete:
 *     summary: 강의 삭제
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 강의 ID
 *     responses:
 *       200:
 *         description: 강의 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 강의를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/:id", deleteLesson);

export default router;
