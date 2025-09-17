const KAKAO_JS_KEY = '' // TODO: 여기에 수호님이 전달한 JavaScript 키를 넣으세요. 환경변수 사용 권장.

export default function Login() {
  const onKakaoLogin = () => {
    const redirectUri = `${window.location.origin}/auth/kakao/callback`
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${encodeURIComponent(KAKAO_JS_KEY)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`
    window.location.href = kakaoAuthUrl
  }

  return (
    <main style={{fontFamily: 'Arial, sans-serif', padding: 24}}>
      <h1>로그인</h1>
      <form style={{maxWidth: 420}} onSubmit={(e) => e.preventDefault()}>
        <button
          type="button"
          onClick={onKakaoLogin}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px 16px',
            background: '#FEE500',
            color: '#191919',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          카카오로 시작하기
        </button>
      </form>
    </main>
  )
}
