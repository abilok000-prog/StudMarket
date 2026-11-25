import { useState } from 'react'
import { O, errText } from '../i18n/ops.js'
import { db } from '../lib/api.js'
import { Admin } from '../screens/admin/Admin.jsx'

/* ───── Admin access request sheet ───── */
export function AdminRequestSheet({ lang, onClose, onSent }) {
  const o = O[lang]
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const send = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { onSent(await db.requestAdmin(reason.trim())) } catch (er) { setErr(errText(o, er)) } finally { setBusy(false) }
  }
  return (
    <div className="scrim" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={send}>
        <div className="req-hero"><span>🛡</span></div>
        <div className="h3" style={{ textAlign: 'center' }}>{o.reqTitle}</div>
        <div className="muted" style={{ textAlign: 'center', fontSize: 14 }}>{o.reqText}</div>
        <textarea className="field" rows={3} maxLength={500} placeholder={o.reason} value={reason} onChange={(e) => setReason(e.target.value)} />
        {err && <div className="err">{err}</div>}
        <button className="btn solid block" disabled={busy}>{busy ? <span className="spinner" /> : o.sendReq}</button>
        <button type="button" className="btn block ghost" onClick={onClose}>✕</button>
      </form>
    </div>
  )
}
