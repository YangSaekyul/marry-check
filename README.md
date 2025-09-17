# marry-check

결혼 준비 웹 플랫폼(초기 설정)

- Monorepo 구조
  - frontend: Next.js 프론트엔드
  - backend: Firebase Functions 백엔드

설치 및 실행

프론트엔드

1. cd frontend
2. npm install
3. npm run dev

백엔드 (Firebase emulators 권장)

1. cd backend/functions
2. npm install
3. firebase emulators:start --only functions

참고: Firebase CLI 설치 및 로그인 필요
