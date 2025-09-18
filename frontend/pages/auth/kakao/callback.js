import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import { auth } from '../../../lib/firebaseClient'
import { signInWithCustomToken } from 'firebase/auth'

export default function KakaoCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('인가 코드를 받고 있습니다...')

  useEffect(() => {
    if (!router.isReady) return
    const { code } = router.query
    if (!code) return

    const doExchange = async () => {
      try {
        // 백엔드 함수 URL: 우선 환경변수 사용, 없으면 배포된 함수 URL을 기본값으로 사용
        const fnUrl = process.env.NEXT_PUBLIC_KAKAO_LOGIN_FN_URL || 'https://us-central1-marry-check.cloudfunctions.net/kakaoLogin'

        const resp = await fetch(fnUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirectUri: `${window.location.origin}/auth/kakao/callback` })
        })

        const data = await resp.json()

        if (!resp.ok || !data.success || !data.token) {
          setStatus('error')
          setMessage('로그인에 실패했습니다. 다시 시도해주세요.')
          setTimeout(() => router.replace('/login'), 2500)
          return
        }

        // Firebase 클라이언트로 커스텀 토큰으로 로그인
        signInWithCustomToken(auth, data.token)
          .then((userCredential) => {
            // 로그인 성공 후 로컬 상태 저장 및 메인으로 이동
            localStorage.setItem('isAuthenticated', 'true')
            setStatus('success')
            setMessage('로그인 성공, 메인으로 이동합니다...')
            router.replace('/')
          })
          .catch(() => {
            setStatus('error')
            setMessage('로그인에 실패했습니다. 다시 시도해주세요.')
            setTimeout(() => router.replace('/login'), 2500)
          })
      } catch (err) {
        setStatus('error')
        setMessage('로그인에 실패했습니다. 다시 시도해주세요.')
        // 짧은 안내 후 로그인 페이지로 이동
        setTimeout(() => router.replace('/login'), 2500)
      }
    }

    doExchange()
  }, [router])

  return (
    <main style={{fontFamily: 'Arial, sans-serif', padding: 24}}>
      <h1>카카오 인증 콜백</h1>
      <p>{message}</p>
    </main>
  )
}
