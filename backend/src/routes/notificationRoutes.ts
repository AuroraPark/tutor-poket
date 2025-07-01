import { Router } from "express";
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController";

const router = Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: 알림 목록 조회
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: tutorId
 *         schema:
 *           type: integer
 *         description: 특정 튜터의 알림만 조회 (선택사항)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [LESSON_REMINDER, REPORT_READY, ASSIGNMENT_DUE, GENERAL]
 *         description: 특정 타입의 알림만 조회 (선택사항)
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *         description: 읽음/안읽음 상태로 필터링 (선택사항)
 *     responses:
 *       200:
 *         description: 알림 목록 조회 성공
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
 *                     $ref: '#/components/schemas/Notification'
 *       500:
 *         description: 서버 오류
 */
router.get("/", getNotifications);

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: 알림 생성
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *               - message
 *               - tutorId
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [LESSON_REMINDER, REPORT_READY, ASSIGNMENT_DUE, GENERAL]
 *                 description: 알림 타입
 *               title:
 *                 type: string
 *                 description: 알림 제목
 *               message:
 *                 type: string
 *                 description: 알림 내용
 *               lessonId:
 *                 type: integer
 *                 description: 관련 강의 ID (선택사항)
 *               reportId:
 *                 type: integer
 *                 description: 관련 리포트 ID (선택사항)
 *               tutorId:
 *                 type: integer
 *                 description: 튜터 ID
 *     responses:
 *       201:
 *         description: 알림이 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post("/", createNotification);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: 알림 읽음 처리
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 알림 ID
 *     responses:
 *       200:
 *         description: 알림 읽음 처리 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 알림을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.patch("/:id/read", markAsRead);

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: 모든 알림 읽음 처리
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: tutorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 튜터 ID
 *     responses:
 *       200:
 *         description: 모든 알림 읽음 처리 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 튜터 ID가 필요함
 *       500:
 *         description: 서버 오류
 */
router.patch("/read-all", markAllAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: 알림 삭제
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 알림 ID
 *     responses:
 *       200:
 *         description: 알림 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 알림을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/:id", deleteNotification);

export default router;
