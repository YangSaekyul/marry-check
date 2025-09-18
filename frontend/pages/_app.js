import {useEffect} from 'react'
import {useRouter} from 'next/router'

import '../styles/globals.css'

function MyApp({Component, pageProps}) {
  const router = useRouter()

  useEffect(() => {
    // 간단한 인증 확인 - 실제 구현 시 토큰 검증 로직으로 교체하세요.
    const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true'

    // Component.requiresAuth가 true인 페이지에 비로그인 상태로 접근하면 /login으로 리다이렉트
    if (Component.requiresAuth && !isAuthenticated) {
      router.replace('/login')
    }
  }, [Component, router])

  return <Component {...pageProps} />
}

export default MyApp

// 사용법 예시:
// 향후 보호가 필요한 페이지에서 `export default function SecretPage(){...}` 아래에
// `SecretPage.requiresAuth = true` 를 추가하면 자동으로 /login으로 리다이렉트 됩니다.