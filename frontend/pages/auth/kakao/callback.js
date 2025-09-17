import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'

export default function KakaoCallback() {
  const router = useRouter()
  const [code, setCode] = useState(null)

  useEffect(() => {
    if (!router.isReady) return
    const { code } = router.query
    setCode(code || null)
  }, [router])

  return (
    <main style={{fontFamily: 'Arial, sans-serif', padding: 24}}>
      <h1>카카오 인증 콜백</h1>
      {code ? (
        <p>인가 코드: {code}</p>
      ) : (
        <p>인가 코드를 받고 있습니다...</p>
      )}
    </main>
  )
}
