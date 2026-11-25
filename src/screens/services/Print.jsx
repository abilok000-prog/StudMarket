import { useState } from 'react'
import { useApp } from '../../context/AppContext.js'
import { PRINT_PRICE } from '../../data/catalog.js'
import { fmt } from '../../lib/format.js'

export function Print() {
  const { t, addOrder, setQr } = useApp()
  const [file, setFile] = useState(null)
  const [pages, setPages] = useState(10)
  const [copies, setCopies] = useState(1)
  const [mode, setMode] = useState('bw')
  const total = pages * copies * PRINT_PRICE[mode]
  return (
    <div className="svc-body">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <label className="drop">
          <input type="file" hidden accept=".pdf,.doc,.docx,.png,.jpg" onChange={(e) => setFile(e.target.files[0]?.name || null)} />
          {t.print.choose}<b>{file || 'PDF · DOCX · JPG'}</b>
        </label>
        <div className="row" style={{ gap: 32 }}>
          <div><span className="label">{t.print.pages}</span><div className="stepper"><button onClick={() => setPages(Math.max(1, pages - 1))}>−</button><span>{pages}</span><button onClick={() => setPages(pages + 1)}>+</button></div></div>
          <div><span className="label">{t.print.copies}</span><div className="stepper"><button onClick={() => setCopies(Math.max(1, copies - 1))}>−</button><span>{copies}</span><button onClick={() => setCopies(copies + 1)}>+</button></div></div>
        </div>
        <div><span className="label">{t.print.color}</span>
          <div className="seg" style={{ maxWidth: 320 }}>
            <button className={mode === 'bw' ? 'on' : ''} onClick={() => setMode('bw')}>{t.print.bw} · {PRINT_PRICE.bw} {t.tg}</button>
            <button className={mode === 'color' ? 'on' : ''} onClick={() => setMode('color')}>{t.print.color} · {PRINT_PRICE.color} {t.tg}</button>
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="mono muted" style={{ fontSize: 13 }}>{pages} × {copies} × {PRINT_PRICE[mode]} {t.tg}</div>
        <div className="sum"><span className="muted">{t.total}</span><b>{fmt(total)} {t.tg}</b></div>
        <button className="btn solid block" disabled={!file} onClick={() => { setQr(addOrder({ service: 'print', title: `${file} · ${pages * copies} p.`, total })); setFile(null) }}>{t.print.send}</button>
      </div>
    </div>
  )
}
