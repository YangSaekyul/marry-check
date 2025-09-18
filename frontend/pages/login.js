
import { useState } from 'react'
import { auth } from '../lib/firebaseClient'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [message, setMessage] = useState('')

  const onKakaoLogin = () => {
    const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || ''
    const redirectUri = `${window.location.origin}/auth/kakao/callback`
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${encodeURIComponent(KAKAO_JS_KEY)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`
    window.location.href = kakaoAuthUrl
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password)
        setMessage('회원가입 성공!')
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        setMessage('로그인 성공!')
      }
    } catch (err) {
      console.error(err)
      setMessage(err.message || '에러가 발생했습니다.')
    }
  }

  return (
    <main style={{fontFamily: 'Arial, sans-serif', padding: 24}}>
      <h1>로그인</h1>
      <form style={{maxWidth: 420}} onSubmit={onSubmit}>
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
            cursor: 'pointer',
            marginBottom: 12
          }}
        >
          카카오로 시작하기
        </button>

        <div style={{borderTop: '1px solid #eee', paddingTop: 16, marginTop: 8}}>
          <div style={{display: 'grid', gap: 8}}>
            <input placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} style={{padding: 10, borderRadius: 6, border: '1px solid #ddd'}} />
            <input placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{padding: 10, borderRadius: 6, border: '1px solid #ddd'}} />
            <div style={{display: 'flex', gap: 8}}>
              <button type="submit" style={{padding: '10px 12px', background: '#2563eb', color: '#fff', borderRadius: 6, fontWeight: 700}}>
                {mode === 'signup' ? '회원가입' : '이메일 로그인'}
              </button>
              <button type="button" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} style={{padding: '10px 12px', borderRadius: 6}}>
                {mode === 'signup' ? '로그인으로' : '회원가입으로'}
              </button>
            </div>
            {message && <p style={{color: '#ef4444'}}>{message}</p>}
          </div>
        </div>
      </form>
    </main>
  )
}
