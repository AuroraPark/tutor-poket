# Tutor Pocket

![main-page](https://private-user-images.githubusercontent.com/47839204/461954114-9977fb9f-8064-4eae-b07b-77c7bf895b5c.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTE1MzUzMDksIm5iZiI6MTc1MTUzNTAwOSwicGF0aCI6Ii80NzgzOTIwNC80NjE5NTQxMTQtOTk3N2ZiOWYtODA2NC00ZWFlLWIwN2ItNzdjN2JmODk1YjVjLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA3MDMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNzAzVDA5MzAwOVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTU3ODNlNzViMzJkODQzZjQxM2RhZTU2ZGU1MmYzMmM4ZDJmODE0YWQyNGQxZjgwMzJhNDJkZGE0ZjMwNTBhZDUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.1-KniXvYUgfiUvIjbezukWD8dx-sA-RJmMkJ1fQJKN0)

> 과외 선생님과 수강생 관리를 위한 간편한 학원 운영 서비스

## 🧩 프로젝트 소개

**Tutor Pocket**은 과외 선생님을 위한 학생 관리, 과제 등록, 레포트 기능을 제공하는 간편한 과외 운영 시스템입니다.  
클래스업(Classup)의 기능을 벤치마킹하여 백엔드 및 프론트엔드를 구현하였으며, 실사용을 가정한 테스트 데이터도 포함되어 있습니다.

> **🔗 백엔드 API 문서:** [Swagger 보기](https://tutor-poket.onrender.com/api-docs/)

(50초 정도 딜레이가 있을 수 있습니다.)

> **🔗 프론트엔드 데모:** [Vercel 배포 보기](https://frontend-silk-beta-68.vercel.app/)

테스트 계정:

이메일: dev.hmpark@gmail.com
비밀번호: Classup12!@


---

## 🛠 사용 기술 스택

### Back-end

- Node.js, Express.js, TypeScript
- Prisma ORM + PostgreSQL
- Swagger(OpenAPI) 문서 자동화
- Render 배포 (Database 연동 포함)

### Front-end

- React, TypeScript, Zustand, React Query
- ShadCN UI 기반 디자인
- Vite + Vercel 배포

---

## 🧱 주요 기능


![students](https://private-user-images.githubusercontent.com/47839204/461954886-76f5013e-1cf3-4aef-ab77-7278e53b2951.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTE1MzYzMDgsIm5iZiI6MTc1MTUzNjAwOCwicGF0aCI6Ii80NzgzOTIwNC80NjE5NTQ4ODYtNzZmNTAxM2UtMWNmMy00YWVmLWFiNzctNzI3OGU1M2IyOTUxLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA3MDMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNzAzVDA5NDY0OFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWIxNWY0ODgwNGY2NWMxOGUyMWEwMDdkMzg4OTg2YTVkNjU4M2IwNjI0M2IzNmY2YjU4YjY0NGE1Zjc3YzU1YmUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.gdhVu4DocZ_GI27PrtkVdLb83VYG2Qca8gLQT0plS6c)

- **학생 관리**
  - 수강생 등록 / 목록 / 상세 조회

![Reports](https://private-user-images.githubusercontent.com/47839204/461956924-a733a9ea-5e3d-4596-b358-5038f51add04.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTE1MzYzNTEsIm5iZiI6MTc1MTUzNjA1MSwicGF0aCI6Ii80NzgzOTIwNC80NjE5NTY5MjQtYTczM2E5ZWEtNWUzZC00NTk2LWIzNTgtNTAzOGY1MWFkZDA0LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA3MDMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNzAzVDA5NDczMVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTI5Mzk5NTJjYmQzODU3ZWM1OGUwNGFhYTk1NWYwZjRmYjRmMmZhMGM4ZmIzNjQ2MWEwNTQ0YmFiYmM4YTdmOTImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.3a9N4cKjoF4IrjZ_k7QB9z8fkTAuRIF_6Xu08XaDHd0)
  
- **과제 관리**
  - 과제 생성 / 목록 / 상태별 필터링

![Alerts](https://private-user-images.githubusercontent.com/47839204/461954468-6b864acd-6542-4051-a276-61d50b08ba15.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTE1MzY0MTUsIm5iZiI6MTc1MTUzNjExNSwicGF0aCI6Ii80NzgzOTIwNC80NjE5NTQ0NjgtNmI4NjRhY2QtNjU0Mi00MDUxLWEyNzYtNjFkNTBiMDhiYTE1LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA3MDMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNzAzVDA5NDgzNVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWU4ZGVmYmYyZjU3NDg3ZjU4M2JhYTc2OWEzZmQ5MDA1MTk5NzE4MDA5MTgyZWJhZTgwM2EwZWJhNGExMDJkMmYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.FjX849vGi1PxLkknwdB8C0eumvBEW6zTFqqIeB7nF0Q)

- **수업 체크**
  - 예정/취소/완료 구분 알림 및 기록
  
- **강사 전용 회원가입/로그인 (확장 예정)**

---

## 📁 프로젝트 구조

```bash
tutor-pocket/
├── backend/        # Node.js + Express 서버
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── prisma/
│   └── ...
├── frontend/       # React 프론트엔드
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   └── ...
└── README.md
```
