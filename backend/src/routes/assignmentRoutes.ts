import { Router } from "express";
import {
  getAssignments,
  createAssignment,
  getAssignmentById,
  updateAssignment,
  updateAssignmentStatus,
  deleteAssignment,
} from "../controllers/assignmentController";

const router = Router();

/**
 * @swagger
 * /api/assignments:
 *   get:
 *     summary: 과제 목록 조회
 *     tags: [Assignments]
 *     parameters:
 *       - in: query
 *         name: reportId
 *         schema:
 *           type: integer
 *         description: 특정 리포트의 과제만 조회 (선택사항)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, SUBMITTED, REVIEWED]
 *         description: 특정 상태의 과제만 조회 (선택사항)
 *     responses:
 *       200:
 *         description: 과제 목록 조회 성공
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
 *                     $ref: '#/components/schemas/Assignment'
 *       500:
 *         description: 서버 오류
 */
router.get("/", getAssignments);

/**
 * @swagger
 * /api/assignments:
 *   post:
 *     summary: 과제 생성
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - reportId
 *             properties:
 *               title:
 *                 type: string
 *                 description: 과제 제목
 *               content:
 *                 type: string
 *                 description: 숙제 내용
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: 제출 기한
 *               attachment:
 *                 type: string
 *                 description: 첨부자료 (파일 경로 또는 URL)
 *               reportId:
 *                 type: integer
 *                 description: 리포트 ID
 *               status:
 *                 type: string
 *                 enum: [PENDING, SUBMITTED, REVIEWED]
 *                 default: PENDING
 *                 description: 과제 상태
 *     responses:
 *       201:
 *         description: 과제가 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 잘못된 요청 또는 존재하지 않는 리포트
 *       500:
 *         description: 서버 오류
 */
router.post("/", createAssignment);

/**
 * @swagger
 * /api/assignments/{id}:
 *   get:
 *     summary: 특정 과제 조회
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 과제 ID
 *     responses:
 *       200:
 *         description: 과제 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 과제를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/:id", getAssignmentById);

/**
 * @swagger
 * /api/assignments/{id}:
 *   put:
 *     summary: 과제 정보 수정
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 과제 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 과제 제목
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: 제출 기한
 *               status:
 *                 type: string
 *                 enum: [PENDING, SUBMITTED, REVIEWED]
 *                 description: 과제 상태
 *     responses:
 *       200:
 *         description: 과제 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 잘못된 상태값
 *       404:
 *         description: 과제를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/:id", updateAssignment);

/**
 * @swagger
 * /api/assignments/{id}/status:
 *   patch:
 *     summary: 과제 상태 변경
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 과제 ID
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
 *                 enum: [PENDING, SUBMITTED, REVIEWED]
 *                 description: 새로운 과제 상태
 *     responses:
 *       200:
 *         description: 과제 상태 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 잘못된 상태값
 *       404:
 *         description: 과제를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.patch("/:id/status", updateAssignmentStatus);

/**
 * @swagger
 * /api/assignments/{id}:
 *   delete:
 *     summary: 과제 삭제
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 과제 ID
 *     responses:
 *       200:
 *         description: 과제 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 과제를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/:id", deleteAssignment);

export default router;
