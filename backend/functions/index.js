const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// 기존 예시함수
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send({message: '안녕하세요! marry-check Firebase Functions가 응답합니다.'});
});

/**
 * API 명세: 회원가입
 * 경로: POST /api/signup
 * 요청 데이터: { "email": "user@example.com", "password": "password123" }
 * 성공 응답: { "success": true, "message": "회원가입 성공" }
 *
 * 임시 구현: 실제 로직 없이 항상 성공 응답을 반환합니다.
 */
exports.signup = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ success: false, message: 'Method Not Allowed' });
  }

  // 요청 바디 예시 검증(선택적)
  // const { email, password } = req.body;
  // TODO: 실제 회원가입 로직(검증, DB 저장)은 추후 구현

  return res.status(200).send({ success: true, message: '회원가입 성공' });
});

/**
 * API 명세: 로그인
 * 경로: POST /api/login
 * 요청 데이터: { "email": "user@example.com", "password": "password123" }
 * 성공 응답: { "success": true, "message": "로그인 성공", "user": { "uid": "some-uid", "email": "user@example.com" } }
 *
 * 임시 구현: 실제 인증 로직 없이 항상 성공 응답을 반환합니다.
 */
exports.login = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ success: false, message: 'Method Not Allowed' });
  }

  // const { email, password } = req.body;
  // TODO: 실제 인증 로직(토큰 발급 등)은 추후 구현

  return res.status(200).send({
    success: true,
    message: '로그인 성공',
    user: { uid: 'some-uid', email: 'user@example.com' }
  });
});
