export default function Login() {
  return (
    <main style={{fontFamily: 'Arial, sans-serif', padding: 24}}>
      <h1>로그인</h1>
      <form style={{maxWidth: 420}} onSubmit={(e) => e.preventDefault()}>
        <button
          type="button"
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
