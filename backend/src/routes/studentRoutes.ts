import { Router } from "express";
import {
  getStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentLessons,
} from "../controllers/studentController";

const router = Router();

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: 학생 목록 조회
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: 학생 목록 조회 성공
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
 *                     $ref: '#/components/schemas/Student'
 *       500:
 *         description: 서버 오류
 */
router.get("/", getStudents);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: 학생 등록
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - subject
 *               - tutorId
 *             properties:
 *               name:
 *                 type: string
 *                 description: 학생 이름
 *               subject:
 *                 type: string
 *                 description: 과목
 *               tutorId:
 *                 type: integer
 *                 description: 담당 튜터 ID
 *               contact:
 *                 type: string
 *                 description: 연락처
 *               memo:
 *                 type: string
 *                 description: 메모
 *     responses:
 *       201:
 *         description: 학생이 성공적으로 등록됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 잘못된 요청 또는 존재하지 않는 튜터
 *       500:
 *         description: 서버 오류
 */
router.post("/", createStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: 특정 학생 조회
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 학생 ID
 *     responses:
 *       200:
 *         description: 학생 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 학생을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/:id", getStudentById);

/**
 * @swagger
 * /api/students/{studentId}/lessons:
 *   get:
 *     summary: 학생별 수업 목록 조회
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 학생 ID
 *     responses:
 *       200:
 *         description: 학생별 수업 목록 조회 성공
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
 *                     student:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         subject:
 *                           type: string
 *                         contact:
 *                           type: string
 *                         memo:
 *                           type: string
 *                     lessons:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           date:
 *                             type: string
 *                             format: date-time
 *                           topic:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [SCHEDULED, COMPLETED, CANCELED]
 *                           report:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               content:
 *                                 type: string
 *                               assignments:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: integer
 *                                     title:
 *                                       type: string
 *                                     content:
 *                                       type: string
 *                                     status:
 *                                       type: string
 *                                       enum: [PENDING, SUBMITTED, REVIEWED]
 *                                     dueDate:
 *                                       type: string
 *                                       format: date-time
 *                                     attachment:
 *                                       type: string
 *       404:
 *         description: 학생을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/:studentId/lessons", getStudentLessons);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: 학생 정보 수정
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 학생 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 학생 이름
 *               subject:
 *                 type: string
 *                 description: 과목
 *               tutorId:
 *                 type: integer
 *                 description: 담당 튜터 ID
 *               contact:
 *                 type: string
 *                 description: 연락처
 *               memo:
 *                 type: string
 *                 description: 메모
 *     responses:
 *       200:
 *         description: 학생 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 잘못된 요청 또는 존재하지 않는 튜터
 *       404:
 *         description: 학생을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/:id", updateStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: 학생 삭제
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 학생 ID
 *     responses:
 *       200:
 *         description: 학생 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 학생을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/:id", deleteStudent);

export default router;
