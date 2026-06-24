# gy-web

GY 온라인 백엔드 웹서버 (로그인 · 캐릭터 저장)

## 로컬 실행

### 사전 준비
- Node 24+
- Docker Desktop

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
cp .env.example .env
# .env의 JWT_SECRET, SERVICE_SECRET 값 변경
```

### 3. DB 실행
```bash
docker compose up -d
```

### 4. DB 마이그레이션
```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. 서버 실행
```bash
npm run dev        # 개발 (파일 변경 감지)
npm run build      # 빌드
npm start          # 프로덕션
```

### DB 종료 / 재시작
```bash
docker compose down       # 종료 (데이터 유지)
docker compose down -v    # 종료 + 데이터 초기화
docker compose up -d      # 재시작
```

### 테스트
```bash
npm test           # 전체 실행
npm run test:watch # 감시 모드
```

## 엔드포인트

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | /auth/login | - | 로그인 → JWT 발급 |
| POST | /characters | JWT | 캐릭터 생성 |
| GET | /characters | JWT | 캐릭터 목록 |
| GET | /internal/characters/:id/save | X-Service-Secret | 세이브 불러오기 |
| PUT | /internal/characters/:id/save | X-Service-Secret | 세이브 저장 |
