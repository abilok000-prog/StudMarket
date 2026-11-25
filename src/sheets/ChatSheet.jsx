import { useState, useEffect, useRef } from 'react'
import { O } from '../i18n/ops.js'
import { db } from '../lib/api.js'
import { load } from '../lib/storage.js'

/* ───── Chat sheet ───── */
export function ChatSheet({ lang, t, order, me, staffMode, onClose }) {
  const o = O[lang]
  const [msgs, setMsgs] = useState([])
  const [text, setText] = useState('')
  const end = useRef()
  const load = () => db.listMessages(order.id).then(setMsgs).catch(() => {})
  useEffect(() => { load(); const id = setInterval(load, 3000); return () => clearInterval(id) }, [order.id])
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs.length])
  const send = async (e) => {
    e.preventDefault()
    const body = text.trim(); if (!body) return
    setText('')
    const tmp = { id: 'tmp' + Date.now(), body, sender_id: me.id, is_staff: staffMode, created_at: new Date().toISOString(), pending: true }
    setMsgs((x) => [...x, tmp])
    try { await db.sendMessage({ order_id: order.id, body, sender_name: me.name, is_staff: staffMode }); load() } catch (er) { setMsgs((x) => x.filter((m) => m.id !== tmp.id)); alert(er.message) }
  }
  const time = (iso) => new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal chat" onClick={(e) => e.stopPropagation()}>
        <div className="chat-head">
          <div><div className="h3">{o.chatTitle}</div><div className="muted mono" style={{ fontSize: 12 }}>{order.id} · {t.services[order.service].name}{staffMode && order.customer_name ? ` · ${order.customer_name}` : ''}</div></div>
          <button className="btn sm" onClick={onClose}>✕</button>
        </div>
        <div className="chat-body">
          {msgs.length === 0 && <div className="muted" style={{ textAlign: 'center', padding: 24, fontSize: 14 }}>{o.noMsg}</div>}
          {msgs.map((m) => {
            const mine = m.sender_id === me.id
            return (
              <div key={m.id} className={`bubble ${mine ? 'mine' : ''} ${m.pending ? 'pending' : ''}`}>
                {!mine && <div className="who">{m.is_staff ? `🛡 ${o.staff}` : m.sender_name}</div>}
                {m.body}
                <span className="tm">{time(m.created_at)}</span>
              </div>
            )
          })}
          <div ref={end} />
        </div>
        <form className="chat-input" onSubmit={send}>
          <input className="field" placeholder={o.write} value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} />
          <button className="btn solid" aria-label={o.send} disabled={!text.trim()}>↑</button>
        </form>
      </div>
    </div>
  )
}
