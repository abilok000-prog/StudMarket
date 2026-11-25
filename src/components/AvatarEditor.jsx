import { useRef } from 'react'
import { Avatar } from './Avatar.jsx'
import { AVATAR_COLORS, EMOJIS } from '../data/profileOptions.js'
import { fileToAvatar } from '../lib/api.js'

export function AvatarEditor({ value, onChange, a }) {
  const ref = useRef()
  return (
    <div className="ava-editor">
      <div className="ava-preview"><Avatar profile={value} size={112} /></div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <button className="btn sm solid" onClick={() => ref.current.click()}>{a.upload}</button>
        {value.avatar_url && <button className="btn sm" onClick={() => onChange({ avatar_url: null })}>{a.remove}</button>}
        <input ref={ref} type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files[0]; if (f) onChange({ avatar_url: await fileToAvatar(f) }) }} />
      </div>
      <div className="emoji-grid">
        {EMOJIS.map((em) => <button key={em} className={value.avatar_emoji === em && !value.avatar_url ? 'on' : ''} onClick={() => onChange({ avatar_emoji: em, avatar_url: null })}>{em}</button>)}
      </div>
      <div className="color-row">
        {Object.entries(AVATAR_COLORS).map(([k, g]) => <button key={k} aria-label={k} className={value.avatar_color === k ? 'on' : ''} style={{ background: g }} onClick={() => onChange({ avatar_color: k })} />)}
      </div>
    </div>
  )
}
