import { Router } from "express";
import {
  getReports,
  createReport,
  getReportById,
  updateReport,
  deleteReport,
} from "../controllers/reportController";

const router = Router();

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: 리포트 목록 조회
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: lessonId
 *         schema:
 *           type: integer
 *         description: 특정 강의의 리포트만 조회 (선택사항)
 *     responses:
 *       200:
 *         description: 리포트 목록 조회 성공
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
 *                     $ref: '#/components/schemas/Report'
 *       500:
 *         description: 서버 오류
 */
router.get("/", getReports);

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: 리포트 생성
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - lessonId
 *             properties:
 *               content:
 *                 type: string
 *                 description: 과외 피드백 내용
 *               lessonId:
 *                 type: integer
 *                 description: 강의 ID
 *     responses:
 *       201:
 *         description: 리포트가 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 잘못된 요청 또는 이미 리포트가 존재함
 *       500:
 *         description: 서버 오류
 */
router.post("/", createReport);

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: 특정 리포트 조회
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리포트 ID
 *     responses:
 *       200:
 *         description: 리포트 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 리포트를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/:id", getReportById);

/**
 * @swagger
 * /api/reports/{id}:
 *   put:
 *     summary: 리포트 수정
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리포트 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 과외 피드백 내용
 *     responses:
 *       200:
 *         description: 리포트 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 리포트를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/:id", updateReport);

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: 리포트 삭제
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리포트 ID
 *     responses:
 *       200:
 *         description: 리포트 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 리포트를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/:id", deleteReport);

export default router;
