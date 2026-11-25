import { useState } from 'react'
import { AvatarEditor } from '../components/AvatarEditor.jsx'
import { A } from '../i18n/auth.js'
import { db } from '../lib/api.js'
import { Profile } from '../screens/Profile.jsx'

/* ───── Profile editor (sheet) ───── */
export function ProfileEditor({ lang, profile, onSaved, onClose }) {
  const a = A[lang]
  const [p, setP] = useState(profile)
  const [busy, setBusy] = useState(false)
  const up = (o) => setP((x) => ({ ...x, ...o }))
  const save = async () => {
    setBusy(true)
    try { onSaved(await db.saveProfile(p)) } catch (e) { alert(e.message) } finally { setBusy(false) }
  }
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal tall" onClick={(e) => e.stopPropagation()}>
        <div className="h3">{a.edit}</div>
        <AvatarEditor value={p} onChange={up} a={a} />
        <input className="field" placeholder={a.name} value={p.full_name || ''} onChange={(e) => up({ full_name: e.target.value })} />
        <input className="field" placeholder={a.university} value={p.university || ''} onChange={(e) => up({ university: e.target.value })} />
        <input className="field" placeholder={a.faculty} value={p.faculty || ''} onChange={(e) => up({ faculty: e.target.value })} />
        <div className="seg">{[1, 2, 3, 4, 5].map((c) => <button key={c} className={p.course === c ? 'on' : ''} onClick={() => up({ course: c })}>{c}</button>)}</div>
        <input className="field" placeholder={a.phone} value={p.phone || ''} onChange={(e) => up({ phone: e.target.value })} />
        <textarea className="field" rows="2" placeholder={a.bio} value={p.bio || ''} onChange={(e) => up({ bio: e.target.value })} />
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose}>✕</button>
          <button className="btn solid" disabled={busy || !p.full_name} onClick={save}>{busy ? <span className="spinner" /> : a.save}</button>
        </div>
      </div>
    </div>
  )
}
