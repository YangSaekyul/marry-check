export default function Signup() {
  return (
    <main style={{fontFamily: 'Arial, sans-serif', padding: 24}}>
      <h1>회원가입</h1>
      <form style={{maxWidth: 420}} onSubmit={(e) => e.preventDefault()}>
        <label style={{display: 'block', marginBottom: 8}}>
          이메일
          <input type="email" name="email" required style={{display: 'block', width: '100%', padding: 8, marginTop: 6}} />
        </label>
        <label style={{display: 'block', marginBottom: 8}}>
          비밀번호
          <input type="password" name="password" required style={{display: 'block', width: '100%', padding: 8, marginTop: 6}} />
        </label>
        <label style={{display: 'block', marginBottom: 16}}>
          비밀번호 확인
          <input type="password" name="passwordConfirm" required style={{display: 'block', width: '100%', padding: 8, marginTop: 6}} />
        </label>
        <button type="submit" style={{padding: '10px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 6}}>가입하기</button>
      </form>
    </main>
  )
}
