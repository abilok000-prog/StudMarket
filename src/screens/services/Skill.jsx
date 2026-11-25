import { useState } from 'react'
import { useApp } from '../../context/AppContext.js'
import { fmt } from '../../lib/format.js'

export function Skill() {
  const { t, skills, addSkill, addOrder, notify } = useApp()
  const [form, setForm] = useState({})
  return (
    <div className="svc-body">
      <div className="items">
        {skills.map((s) => (
          <div key={s.id} className="item">
            <span className="nm">{s.subject}</span>
            <span className="pr">{s.price ? `${fmt(s.price)} ${t.tg}` : t.skill.free}</span>
            <span className="sp">{s.name} — {s.note}</span>
            <button className="btn sm" onClick={() => addOrder({ service: 'skill', title: `${s.subject} · ${s.name}`, total: s.price })}>{t.skill.ask}</button>
          </div>
        ))}
      </div>
      <div className="panel">
        <div className="h3">{t.skill.add}</div>
        <input className="field" placeholder={t.skill.subject} value={form.subject || ''} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <input className="field" placeholder={t.skill.note} value={form.note || ''} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <input className="field" type="number" min="0" placeholder={`${t.tg} (0 = ${t.skill.free})`} value={form.price || ''} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <button className="btn solid block" disabled={!form.subject} onClick={() => { addSkill({ subject: form.subject, note: form.note || '', price: Number(form.price) || 0 }).catch((e) => notify(e.message)); setForm({}) }}>{t.lost.publish}</button>
      </div>
    </div>
  )
}
