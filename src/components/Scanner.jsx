import { useState, useEffect, useRef } from 'react'
import { A } from '../i18n/auth.js'
import { O } from '../i18n/ops.js'

/* ───── QR scanner (staff) ───── */
export function Scanner({ lang, onResult, bare }) {
  const o = O[lang]
  const rid = useRef('qr-' + Math.random().toString(36).slice(2, 8)).current
  const [code, setCode] = useState('')
  const [camErr, setCamErr] = useState(false)
  const busy = useRef(false)
  useEffect(() => {
    let scanner; let stopped = false
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (stopped) return
      scanner = new Html5Qrcode(rid)
      scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: 220 }, async (txt) => {
        if (busy.current) return
        const m = txt.match(/^STUDMARKET:([A-Z0-9-]+):?([a-f0-9]*)$/)
        if (!m) return
        busy.current = true
        await onResult(m[1], m[2] || null)
        setTimeout(() => { busy.current = false }, 2500)
      }).catch(() => setCamErr(true))
    }).catch(() => setCamErr(true))
    return () => { stopped = true; scanner?.isScanning && scanner.stop().catch(() => {}) }
  }, [])
  return (
    <div className={bare ? '' : 'card'} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {!bare && <div className="h3">{o.scanTitle}</div>}
      <div className="scan-box"><div id={rid} />{camErr ? <div className="scan-err">📷 {o.camErr}</div> : <div className="scan-frame" />}</div>
      <div className="muted" style={{ fontSize: 13 }}>{o.scanHint}</div>
      <form className="row" style={{ flexWrap: 'nowrap' }} onSubmit={async (e) => { e.preventDefault(); if (code.trim()) { await onResult(code.trim().toUpperCase(), null); setCode('') } }}>
        <input className="field" placeholder={`${o.manual}: SM-XXXXX`} value={code} onChange={(e) => setCode(e.target.value)} />
        <button className="btn solid">{o.check}</button>
      </form>
    </div>
  )
}
