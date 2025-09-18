const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// 예시 헬퍼 함수
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send({ message: '안녕하세요! marry-check Firebase Functions가 응답합니다.' });
});

/**
 * 회원가입 (임시)
 */
exports.signup = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ success: false, message: 'Method Not Allowed' });
  }

  return res.status(200).send({ success: true, message: '회원가입 성공' });
});

/**
 * 로그인 (임시)
 */
exports.login = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ success: false, message: 'Method Not Allowed' });
  }

  return res.status(200).send({
    success: true,
    message: '로그인 성공',
    user: { uid: 'some-uid', email: 'user@example.com' }
  });
});

/**
 * 카카오 인가 코드 교환 엔드포인트
 */
exports.kakaoLogin = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const code = body.code;
    const providedRedirect = body.redirectUri;

    if (!code) {
      return res.status(400).send({ success: false, message: 'Missing code in request body' });
    }

    // functions.config() 사용 가능하면 우선 사용, 로컬은 env fallback
    const functionsConfig = (functions.config && functions.config().kakao) ? functions.config().kakao : {};
    const KAKAO_REST_KEY = functionsConfig.rest_key || process.env.KAKAO_REST_KEY;
    const REGISTERED_REDIRECT = functionsConfig.redirect_uri || process.env.KAKAO_REDIRECT_URI || null;

    if (!KAKAO_REST_KEY) {
      return res.status(500).send({ success: false, message: 'Kakao REST key not configured on Functions config or env' });
    }

    const redirectUri = providedRedirect || REGISTERED_REDIRECT;
    if (!redirectUri) {
      return res.status(400).send({ success: false, message: 'redirectUri is required (provide in request or set kakao.redirect_uri in functions config)' });
    }

    // 교환 요청
    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KAKAO_REST_KEY,
        redirect_uri: redirectUri,
        code: code
      })
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) {
      return res.status(400).send({ success: false, message: 'Failed to get token from Kakao', detail: tokenJson });
    }

    const accessToken = tokenJson.access_token;
    if (!accessToken) {
      return res.status(400).send({ success: false, message: 'No access_token in Kakao response', detail: tokenJson });
    }

    // 카카오 사용자 정보 요청
    const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' }
    });

    const userJson = await userRes.json();
    if (!userRes.ok) {
      return res.status(400).send({ success: false, message: 'Failed to get user info from Kakao', detail: userJson });
    }

    const kakaoId = userJson && userJson.id;
    if (!kakaoId) {
      return res.status(400).send({ success: false, message: 'Kakao user id not found', detail: userJson });
    }

    const uid = 'kakao:' + kakaoId;

    // Firebase Auth 사용자 확인/생성
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUser(uid);
    } catch (err) {
      if (err && err.code === 'auth/user-not-found') {
        const displayName = (userJson.kakao_account && userJson.kakao_account.profile && userJson.kakao_account.profile.nickname) || undefined;
        firebaseUser = await admin.auth().createUser({ uid: uid, displayName: displayName });
      } else {
        throw err;
      }
    }

    const customToken = await admin.auth().createCustomToken(uid);

    return res.status(200).send({ success: true, token: customToken });
  } catch (error) {
    console.error('kakaoLogin error', error);
    return res.status(500).send({ success: false, message: 'Internal Server Error', detail: error && error.message ? error.message : String(error) });
  }
});