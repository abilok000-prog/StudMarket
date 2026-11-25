import { useState } from 'react'
import { useApp } from '../../context/AppContext.js'

export function Lost() {
  const { t, lost, addLost, notify } = useApp()
  const [f, setF] = useState('all')
  const [form, setForm] = useState(null)
  const list = lost.filter((p) => f === 'all' || p.type === f)
  return (
    <div className="svc-body">
      <div>
        <div className="filters">
          {[['all', t.all], ['found', t.lost.found], ['lost', t.lost.lostT]].map(([k, l]) => <button key={k} className={f === k ? 'on' : ''} onClick={() => setF(k)}>{l}</button>)}
        </div>
        <div className="posts">
          {list.map((p) => (
            <div className="post" key={p.id}>
              <span className="date">{p.date}</span>
              <div><div className="t"><span className={`tag ${p.type}`}>{p.type === 'found' ? t.lost.found : t.lost.lostT}</span>{p.title}</div><div className="p">{p.place}</div></div>
              <button className="btn sm" onClick={() => notify(t.lost.contacted)}>{t.lost.contact}</button>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="h3">{t.lost.add}</div>
        <div className="seg">
          {['found', 'lost'].map((k) => <button key={k} className={(form?.type || 'found') === k ? 'on' : ''} onClick={() => setForm({ ...form, type: k })}>{k === 'found' ? t.lost.found : t.lost.lostT}</button>)}
        </div>
        <input className="field" placeholder={t.lost.title} value={form?.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="field" placeholder={t.lost.place} value={form?.place || ''} onChange={(e) => setForm({ ...form, place: e.target.value })} />
        <button className="btn solid block" disabled={!form?.title || !form?.place} onClick={() => { addLost({ type: form.type || 'found', title: form.title, place: form.place }).catch((e) => notify(e.message)); setForm(null) }}>{t.lost.publish}</button>
      </div>
    </div>
  )
}
