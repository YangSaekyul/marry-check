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

/**
 * 카카오 인가 코드 교환 엔드포인트
 * 경로: POST /kakaoLogin (functions endpoint URL에 따라 다름)
 * 요청 바디: { code: '인가 코드', redirectUri?: 'optional redirect uri used during authorize' }
 * 동작:
 *  - 카카오 REST 키는 Firebase Functions 환경변수로 설정합니다.
 *    (로컬 개발: process.env.KAKAO_REST_KEY로 테스트 가능)
 *    설정 예시:
 *      firebase functions:config:set kakao.rest_key="YOUR_REST_KEY" kakao.redirect_uri="https://yourdomain/auth/kakao/callback"
 */
exports.kakaoLogin = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { code, redirectUri: providedRedirect } = req.body || {}
    if (!code) {
      return res.status(400).send({ success: false, message: 'Missing code in request body' })
    }

    // REST key: prefer functions config, fallback to env var for local dev
    const functionsConfig = functions.config && functions.config().kakao ? functions.config().kakao : {}
    const KAKAO_REST_KEY = functionsConfig.rest_key || process.env.KAKAO_REST_KEY
    const REGISTERED_REDIRECT = functionsConfig.redirect_uri || process.env.KAKAO_REDIRECT_URI || null

    if (!KAKAO_REST_KEY) {
      return res.status(500).send({ success: false, message: 'Kakao REST key not configured on Functions config or env' })
    }

    // Determine redirect URI to send to token endpoint. Must match the one used to obtain the code.
    const redirectUri = providedRedirect || REGISTERED_REDIRECT
    if (!redirectUri) {
      return res.status(400).send({ success: false, message: 'redirectUri is required (provide in request or set kakao.redirect_uri in functions config)'
      })
    }

    // Exchange code for access token
    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KAKAO_REST_KEY,
        redirect_uri: redirectUri,
        code: code
      })
    })

    const tokenJson = await tokenRes.json()
    if (!tokenRes.ok) {
      return res.status(400).send({ success: false, message: 'Failed to get token from Kakao', detail: tokenJson })
    }

    const accessToken = tokenJson.access_token
    if (!accessToken) {
      return res.status(400).send({ success: false, message: 'No access_token in Kakao response', detail: tokenJson })
    }

    // Fetch user info from Kakao
    const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
    })
    const userJson = await userRes.json()
    if (!userRes.ok) {
      return res.status(400).send({ success: false, message: 'Failed to get user info from Kakao', detail: userJson })
    }

    const kakaoId = userJson && userJson.id
    if (!kakaoId) {
      return res.status(400).send({ success: false, message: 'Kakao user id not found', detail: userJson })
    }

    const uid = `kakao:${kakaoId}`

    // Check if user exists in Firebase Auth; if not, create
    let firebaseUser
    try {
      firebaseUser = await admin.auth().getUser(uid)
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/user-not-found') {
        // Create new user with uid
        const displayName = (userJson.kakao_account && userJson.kakao_account.profile && userJson.kakao_account.profile.nickname) || undefined
        firebaseUser = await admin.auth().createUser({ uid, displayName })
      } else {
        throw err
      }
    }

    // Create custom token for the user
    const customToken = await admin.auth().createCustomToken(uid)

    return res.status(200).send({ success: true, token: customToken })
  } catch (error) {
    console.error('kakaoLogin error', error)
    return res.status(500).send({ success: false, message: 'Internal Server Error', detail: error.message || error })
  }
})
