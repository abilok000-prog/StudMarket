import { useState } from 'react'
import { AvatarEditor } from '../components/AvatarEditor.jsx'
import { INTERESTS, UNIS } from '../data/profileOptions.js'
import { A } from '../i18n/auth.js'
import { db } from '../lib/api.js'

/* ───── Onboarding ───── */
export function Onboarding({ lang, initial, onDone }) {
  const a = A[lang]
  const [step, setStep] = useState(0)
  const [p, setP] = useState({ full_name: '', university: '', faculty: '', course: 1, student_id: '', phone: '', bio: '', interests: [], avatar_color: 'aurora', avatar_emoji: '🎓', avatar_url: null, ...initial })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const up = (o) => setP((x) => ({ ...x, ...o }))
  const steps = [
    { t: a.s1, d: a.s1d, ok: p.full_name.trim().length > 1 },
    { t: a.s2, d: a.s2d, ok: p.university && p.faculty },
    { t: a.s3, d: a.s3d, ok: true },
    { t: a.s4, d: a.s4d, ok: true },
  ]
  const finish = async () => {
    setBusy(true); setErr('')
    try { onDone(await db.saveProfile({ ...p, lang, onboarded: true })) } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }
  return (
    <div className="onb">
      <div className="onb-card" key={step}>
        <div className="onb-progress">{steps.map((_, i) => <i key={i} className={i <= step ? 'on' : ''} />)}</div>
        <span className="kicker">{a.step} {step + 1}{a.of}{steps.length}</span>
        <h2 className="h1" style={{ fontSize: 34 }}>{steps[step].t}</h2>
        <p className="muted">{steps[step].d}</p>

        {step === 0 && <div className="form-stack">
          <input className="field" placeholder={a.name} value={p.full_name} onChange={(e) => up({ full_name: e.target.value })} />
          <input className="field" type="tel" placeholder={`${a.phone} · +7 7__ ___ __ __`} value={p.phone} onChange={(e) => up({ phone: e.target.value })} />
          <textarea className="field" rows="3" placeholder={a.bio} value={p.bio} onChange={(e) => up({ bio: e.target.value })} />
        </div>}

        {step === 1 && <div className="form-stack">
          <div className="chips">{UNIS.map((u) => <button key={u} className={p.university === u ? 'on' : ''} onClick={() => up({ university: u })}>{u}</button>)}</div>
          <input className="field" placeholder={a.university} value={p.university} onChange={(e) => up({ university: e.target.value })} />
          <input className="field" placeholder={a.faculty} value={p.faculty} onChange={(e) => up({ faculty: e.target.value })} />
          <div><span className="label">{a.course}</span>
            <div className="seg">{[1, 2, 3, 4, 5].map((c) => <button key={c} className={p.course === c ? 'on' : ''} onClick={() => up({ course: c })}>{c}</button>)}</div>
          </div>
          <input className="field" placeholder={a.studentId} value={p.student_id} onChange={(e) => up({ student_id: e.target.value })} />
        </div>}

        {step === 2 && <div className="chips big">
          {INTERESTS.map((i) => <button key={i} className={p.interests.includes(i) ? 'on' : ''} onClick={() => setP((x) => ({ ...x, interests: x.interests.includes(i) ? x.interests.filter((y) => y !== i) : [...x.interests, i] }))}>{i}</button>)}
        </div>}

        {step === 3 && <AvatarEditor value={p} onChange={up} a={a} />}

        {err && <div className="err">{err}</div>}
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 'auto' }}>
          {step > 0 ? <button className="btn" onClick={() => setStep(step - 1)}>{a.back}</button> : <span />}
          {step < steps.length - 1
            ? <button className="btn solid" disabled={!steps[step].ok} onClick={() => setStep(step + 1)}>{a.next} →</button>
            : <button className="btn solid" disabled={busy} onClick={finish}>{busy ? <span className="spinner" /> : a.finish + ' 🎉'}</button>}
        </div>
      </div>
    </div>
  )
}
