export default function Home() {
  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: 24 }}>
      <h1>Marry Check</h1>
      <p>로그인에 성공했습니다. 환영합니다!</p>
    </main>
  )
}
// 이 페이지는 로그인이 필요하다는 깃발 꽂기
Home.requiresAuth = true;
