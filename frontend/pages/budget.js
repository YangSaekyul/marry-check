import {useState} from 'react'

export default function Budget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold">지출 관리</h1>
        <p className="text-gray-600 mt-1">예산을 추가하고 지출을 추적하세요.</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-4 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">총 예산</h2>
            <p className="text-2xl font-bold mt-1">₩0</p>
          </div>
          <div>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-indigo-600 text-white px-3 py-2 rounded"
            >
              지출 추가
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium">지출 내역</h3>
          <p className="text-sm text-gray-500 mt-2">아직 기록이 없습니다.</p>
        </div>
      </main>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-medium">지출 추가</h4>
            <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); setIsOpen(false) }}>
              <div>
                <label className="block text-sm text-gray-600">설명</label>
                <input className="w-full border rounded px-2 py-1 mt-1" />
              </div>
              <div>
                <label className="block text-sm text-gray-600">금액</label>
                <input className="w-full border rounded px-2 py-1 mt-1" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded border">취소</button>
                <button type="submit" className="px-3 py-2 rounded bg-indigo-600 text-white">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

Budget.requiresAuth = true
