
import { useState } from 'react'
import { auth, db } from '../lib/firebaseClient'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'

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
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        setMessage('회원가입 성공!')
        // 초대 파라미터가 있으면 커플에 가입 처리
        try {
          const params = new URLSearchParams(window.location.search)
          const invite = params.get('invite')
          if (invite) {
            await updateDoc(doc(db, 'couples', invite), { members: arrayUnion(cred.user.uid) })
            setMessage((m) => m + ' 초대 수락 완료')
          }
        } catch (joinErr) {
          console.error('초대 수락 실패', joinErr)
        }
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        setMessage('로그인 성공!')
        // 로그인 후 invite 파라미터가 있으면 가입 처리
        try {
          const params = new URLSearchParams(window.location.search)
          const invite = params.get('invite')
          if (invite) {
            await updateDoc(doc(db, 'couples', invite), { members: arrayUnion(cred.user.uid) })
            setMessage((m) => m + ' 초대 수락 완료')
          }
        } catch (joinErr) {
          console.error('초대 수락 실패', joinErr)
        }
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

        {process.env.NODE_ENV === 'development' && (
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.setItem('isAuthenticated', 'true')
                window.location.href = '/'
              }
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 16px',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              marginTop: 8
            }}
          >
            개발용 빠른 로그인
          </button>
        )}

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
