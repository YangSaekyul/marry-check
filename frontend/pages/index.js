import {useEffect} from 'react'
import {useRouter} from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // 루트 접근 시 로그인 페이지로 리다이렉트
    router.replace('/login')
  }, [router])

  return null
}
