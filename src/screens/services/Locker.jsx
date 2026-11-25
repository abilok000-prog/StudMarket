import { useState } from 'react'
import { useApp } from '../../context/AppContext.js'
import { LOCKER_PRICE, lockers } from '../../data/catalog.js'
import { A } from '../../i18n/auth.js'
import { fmt } from '../../lib/format.js'

export function Locker() {
  const { t, addOrder, setQr } = useApp()
  const [sel, setSel] = useState(null)
  const [hours, setHours] = useState(2)
  const total = hours * LOCKER_PRICE
  return (
    <div className="svc-body">
      <div>
        <span className="label">{t.locker.pick} · {t.locker.building} A</span>
        <div className="lockers">
          {lockers.map((l) => (
            <button key={l.id} disabled={l.busy} className={`locker ${l.busy ? 'busy' : ''} ${sel === l.id ? 'sel' : ''}`} onClick={() => setSel(l.id)}>{l.id}</button>
          ))}
        </div>
        <div className="legend"><span><i />{t.locker.free}</span><span><i style={{ background: 'var(--rule)', borderColor: 'var(--rule)' }} />{t.locker.busy}</span><span><i style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }} />{sel || '—'}</span></div>
      </div>
      <div className="panel">
        <div><span className="label">{t.locker.duration}</span>
          <div className="seg">{[1, 2, 4, 8].map((h) => <button key={h} className={hours === h ? 'on' : ''} onClick={() => setHours(h)}>{h} {t.hours}</button>)}</div>
        </div>
        <div className="sum"><span className="muted">{t.total}</span><b>{fmt(total)} {t.tg}</b></div>
        <button className="btn solid block" disabled={!sel} onClick={() => { const o = addOrder({ service: 'locker', title: `${sel} · ${hours} ${t.hours}`, total }); setSel(null); setQr(o) }}>{t.confirm}</button>
      </div>
    </div>
  )
}
