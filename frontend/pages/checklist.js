import { useEffect, useMemo, useState } from 'react'
import { db, auth } from '../lib/firebaseClient'
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

// 간단한 Tailwind 유사 스타일을 인라인로 구성 (실제 Tailwind는 CDN이 아닌 Next에서 설정 필요하므로 기본 스타일로 근접 구현)

export default function ChecklistPage() {
  const [items, setItems] = useState([])
  const [activeTab, setActiveTab] = useState('essential')
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(true)

  // 로그인 사용자/커플 키 추출: 사용자 문서에서 coupleId 사용
  const uid = typeof window !== 'undefined' ? auth.currentUser?.uid : undefined
  const [coupleId, setCoupleId] = useState(null)

  useEffect(() => {
    const load = async () => {
      if (!uid) return
      try {
        const uref = doc(db, 'users', uid)
        const snap = await (await import('firebase/firestore')).getDoc(uref)
        const data = snap.data()
        if (data && data.coupleId) setCoupleId(data.coupleId)
      } catch (e) {
        console.error('Failed to load user profile', e)
      }
    }
    load()
  }, [uid])

  // Firestore 경로: projects/{projectId}/databases/(default)/documents/checklists
  const listQuery = useMemo(() => {
    if (!coupleId) return null
    // 모델: checklists 컬렉션, 필드: coupleId, title, status, category
    const col = collection(db, 'checklists')
    return query(
      col,
      where('coupleId', '==', coupleId),
      where('category', '==', activeTab),
      orderBy('createdAt', 'asc')
    )
  }, [db, coupleId, activeTab])

  useEffect(() => {
    if (!listQuery) return
    setLoading(true)
    const unsub = onSnapshot(listQuery, (snap) => {
      const next = []
      snap.forEach((d) => next.push({ id: d.id, ...d.data() }))
      setItems(next)
      setLoading(false)
    })
    return () => unsub()
  }, [listQuery])

  const onAdd = async () => {
    if (!uid || !coupleId) return
    const title = newTitle.trim()
    if (!title) return
    await addDoc(collection(db, 'checklists'), {
      coupleId,
      title,
      status: 'pending',
      category: activeTab,
      createdAt: serverTimestamp()
    })
    setNewTitle('')
    setShowModal(false)
  }

  const toggleDone = async (id, nextDone) => {
    const ref = doc(db, 'checklists', id)
    await updateDoc(ref, { status: nextDone ? 'done' : 'pending' })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Plus Jakarta Sans, Arial, sans-serif', background: '#f8f6f7', color: '#0b0b0b' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e7', padding: '12px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 24, height: 24, color: '#f04299' }}>
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Weddy</h2>
        </div>
        <nav style={{ display: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{ width: 40, height: 40, borderRadius: 9999, background: '#f4f4f5' }}>🔔</button>
          <div style={{ width: 40, height: 40, borderRadius: 9999, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDpGb_oP4sU1-nxTlnsFGrfxQ9b1ICyiXZXDOiz9aNHonJQyG2Q-dc90lrejqL5U4a8pOPTVaTLZiypHjIEIiwk0OjoGF1yj9vKUQpO8rDdoQmlmXNtcZoObtSFt2oL1TOcLn5z2rWHwFvkjjp8-g3UrV8JAFAiUUL4gqqAK_l2HSJPm5PtzfnQikyrUNcwBd_rHZ06tiJ5JerW_ntULYtSX0FBMoZfAPEPKp6w1dNWhdhl8-rexmKBPJymZlO3u-93WnUCdFPgotUc)'}}></div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '32px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>Checklist</h1>
            <p style={{ marginTop: 8, color: '#71717a' }}>Manage your wedding preparations with collaborative, real-time tasks.</p>
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: '1px solid #e4e4e7', display: 'flex', gap: 24 }}>
            {[
              { key: 'essential', label: 'Essential' },
              { key: 'optional', label: 'Optional' },
              { key: 'byTime', label: 'By Time' }
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: '12px 4px',
                  borderBottom: activeTab === t.key ? '2px solid #f04299' : '2px solid transparent',
                  color: activeTab === t.key ? '#f04299' : '#71717a',
                  fontWeight: activeTab === t.key ? 700 : 500
                }}
                aria-current={activeTab === t.key ? 'page' : undefined}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
              {activeTab === 'essential' ? 'Essential Tasks' : activeTab === 'optional' ? 'Optional Tasks' : 'Timeline Tasks'}
            </h3>

            {loading ? (
              <p style={{ color: '#71717a' }}>Loading...</p>
            ) : items.length === 0 ? (
              <p style={{ color: '#71717a' }}>No tasks yet. Add one!</p>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {items.map((it) => {
                  const done = it.status === 'done'
                  return (
                    <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={(e) => toggleDone(it.id, e.target.checked)}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, textDecoration: done ? 'line-through' : 'none' }}>{it.title}</p>
                        {it.dueText ? (
                          <p style={{ fontSize: 12, color: '#71717a' }}>{it.dueText}</p>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Add button */}
      <footer style={{ position: 'sticky', bottom: 0, padding: 16, background: 'rgba(248,246,247,0.8)', backdropFilter: 'blur(6px)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'end' }}>
          <button
            onClick={() => setShowModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 12, background: '#f04299', color: '#fff', padding: '12px 16px', fontWeight: 800, boxShadow: '0 8px 24px rgba(240,66,153,0.3)' }}
          >
            <span style={{ fontSize: 20 }}>＋</span>
            <span>Add Task</span>
          </button>
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 16, padding: 16 }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Add Task</h4>
            <div style={{ display: 'grid', gap: 8 }}>
              <input
                placeholder="Task title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{ border: '1px solid #e4e4e7', padding: '10px 12px', borderRadius: 8 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 12px' }}>Cancel</button>
              <button onClick={onAdd} style={{ padding: '10px 12px', background: '#f04299', color: '#fff', borderRadius: 8, fontWeight: 700 }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

ChecklistPage.requiresAuth = true