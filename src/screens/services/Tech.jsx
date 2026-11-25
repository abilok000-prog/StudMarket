import { useState } from 'react'
import { useApp } from '../../context/AppContext.js'
import { techItems } from '../../data/catalog.js'
import { fmt } from '../../lib/format.js'

export function Tech() {
  const { t, addOrder, setQr } = useApp()
  const [sel, setSel] = useState(techItems[0].id)
  const [days, setDays] = useState(1)
  const item = techItems.find((i) => i.id === sel)
  const total = item.price * days
  return (
    <div className="svc-body">
      <div className="items">
        {techItems.map((i) => (
          <button key={i.id} className={`item ${sel === i.id ? 'sel' : ''}`} onClick={() => setSel(i.id)}>
            <span className="nm">{i.name}</span>
            <span className="pr">{fmt(i.price)} {t.tg}</span>
            <span className="sp">{i.spec}</span>
            <span className="sp" style={{ textAlign: 'right' }}>{t.tech.perDay}</span>
          </button>
        ))}
      </div>
      <div className="panel">
        <div className="h3">{item.name}</div>
        <div><span className="label">{t.tech.period}</span>
          <div className="stepper"><button onClick={() => setDays(Math.max(1, days - 1))}>−</button><span>{days} {t.days}</span><button onClick={() => setDays(Math.min(14, days + 1))}>+</button></div>
        </div>
        <div className="sum"><span className="muted">{t.total}</span><b>{fmt(total)} {t.tg}</b></div>
        <button className="btn solid block" onClick={() => setQr(addOrder({ service: 'tech', title: `${item.name} · ${days} ${t.days}`, total }))}>{t.tech.rent}</button>
      </div>
    </div>
  )
}
