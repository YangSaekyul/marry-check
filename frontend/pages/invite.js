import { useState } from 'react'
import { db, auth } from '../lib/firebaseClient'
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'

export default function InvitePage() {
  const [creating, setCreating] = useState(false)
  const [coupleName, setCoupleName] = useState('')
  const [inviteId, setInviteId] = useState(null)
  const router = useRouter()

  const createInvite = async () => {
    setCreating(true)
    try {
      const curUid = auth.currentUser?.uid
      const col = collection(db, 'couples')
      const ref = await addDoc(col, { name: coupleName || 'My Couple', members: curUid ? [curUid] : [], createdAt: serverTimestamp() })
      // ensure user doc updated with coupleId
      if (curUid) {
        await setDoc(doc(db, 'users', curUid), { coupleId: ref.id }, { merge: true })
      }
      setInviteId(ref.id)
    } catch (e) {
      console.error(e)
    } finally {
      setCreating(false)
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>Create Couple Invite</h1>
      <div style={{ maxWidth: 480, display: 'grid', gap: 8 }}>
        <input placeholder="Couple name" value={coupleName} onChange={(e) => setCoupleName(e.target.value)} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={createInvite} disabled={creating}>Create Invite</button>
          {inviteId && (
            <button onClick={() => { navigator.clipboard.writeText(window.location.origin + '/login?invite=' + inviteId) }}>Copy Link</button>
          )}
        </div>
        {inviteId && (
          <p>Invite link: <a href={'/login?invite=' + inviteId}>{window.location.origin + '/login?invite=' + inviteId}</a></p>
        )}
      </div>
    </main>
  )
}
