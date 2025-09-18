import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-800">대시보드</h1>
        <p className="text-gray-600 mt-1">오늘의 요약과 최근 활동을 확인하세요.</p>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 grid grid-cols-1 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-700">예산 요약</h2>
            <p className="text-3xl font-bold mt-2">₩0</p>
            <p className="text-sm text-gray-500 mt-1">이번 달 지출: ₩0</p>
            <div className="mt-4">
              <Link href="/budget">
                <a className="inline-block bg-indigo-600 text-white px-3 py-2 rounded">지출 관리로 이동</a>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-700">최근 체크리스트 활동</h2>
            <p className="text-sm text-gray-500 mt-2">아직 활동이 없습니다.</p>
          </div>
        </div>

        <aside className="bg-white rounded-lg shadow p-4">
          <h3 className="text-md font-medium text-gray-700">빠른 액션</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/checklist">
                <a className="text-indigo-600">체크리스트 보기</a>
              </Link>
            </li>
            <li>
              <Link href="/invite">
                <a className="text-indigo-600">초대 생성</a>
              </Link>
            </li>
          </ul>
        </aside>
      </main>
    </div>
  )
}

Dashboard.requiresAuth = true
