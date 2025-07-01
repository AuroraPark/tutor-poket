# Tutor Pocket Backend

TypeScript + Express + Prisma를 사용한 튜터링 관리 시스템 백엔드 API

## 🚀 기술 스택

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: SQLite (개발용)
- **ORM**: Prisma
- **Security**: CORS

## 📁 프로젝트 구조

```
backend/
├── src/
│   ├── routes/          # API 라우터
│   ├── controllers/     # 비즈니스 로직
│   ├── types/          # TypeScript 타입 정의
│   ├── app.ts          # Express 앱 설정
│   └── server.ts       # 서버 시작 파일
├── prisma/             # Prisma 스키마 및 마이그레이션
├── .env                # 환경 변수
├── tsconfig.json       # TypeScript 설정
└── package.json        # 프로젝트 의존성
```

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=3000
NODE_ENV=development
```

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 마이그레이션
npm run db:migrate

# 또는 스키마를 데이터베이스에 직접 푸시
npm run db:push
```

### 4. 개발 서버 실행

```bash
npm run dev
```

### 5. 프로덕션 빌드

```bash
npm run build
npm start
```

## 📚 API 엔드포인트

### 튜터 관리

- `POST /api/tutors/register` - 튜터 등록
- `POST /api/tutors/login` - 로그인
- `GET /api/tutors` - 튜터 목록 조회

## 🗄️ 데이터베이스 스키마

### 주요 모델

- **Tutor**: 튜터 정보
- **Student**: 학생 정보
- **Lesson**: 강의 정보
- **Report**: 강의 리포트
- **Assignment**: 과제 정보

## 🔧 개발 스크립트

- `npm run dev` - 개발 서버 실행 (핫 리로드)
- `npm run build` - TypeScript 컴파일
- `npm start` - 프로덕션 서버 실행
- `npm run db:generate` - Prisma 클라이언트 생성
- `npm run db:push` - 스키마를 데이터베이스에 푸시
- `npm run db:migrate` - 마이그레이션 실행
- `npm run db:studio` - Prisma Studio 실행

## 🔒 보안

- CORS 설정으로 허용된 도메인만 접근 가능
- 환경 변수를 통한 민감한 정보 관리

## 📝 TODO

- [ ] JWT 인증 구현
- [ ] 비밀번호 해시화
- [ ] 학생 관리 API
- [ ] 강의 관리 API
- [ ] 리포트 관리 API
- [ ] 과제 관리 API
- [ ] API 문서화 (Swagger)
- [ ] 테스트 코드 작성
