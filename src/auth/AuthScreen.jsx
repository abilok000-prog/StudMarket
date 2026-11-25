import { isNativeApp } from '../lib/platform.js'
import { useState } from 'react'
import { A } from '../i18n/auth.js'
import { auth } from '../lib/api.js'

/* ───── Sign in / Sign up ───── */
export function AuthScreen({ lang, setLang, onAuthed }) {
  const a = A[lang]
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (!f.email || !f.password || (mode === 'register' && !f.name)) return setErr(a.errors.required)
    if (f.password.length < 8) return setErr(a.errors.short)
    setBusy(true)
    try {
      const res = mode === 'login'
        ? await auth.signIn.email({ email: f.email, password: f.password })
        : await auth.signUp.email({ email: f.email, password: f.password, name: f.name })
      if (res.error) throw new Error(res.error.message || res.error.statusText)
      onAuthed(res.data.user, mode === 'register' ? f.name : null)
    } catch (e2) { setErr(e2.message) } finally { setBusy(false) }
  }
  const google = async () => {
    setErr('')
    const res = await auth.signIn.social({ provider: 'google', callbackURL: window.location.origin })
    if (res?.error) setErr(res.error.message)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-art">
        <div className="splash-orb o1" /><div className="splash-orb o2" />
        <div className="auth-art-inner">
          <div className="splash-logo sm">S</div>
          <h1>Stud<span>Market</span></h1>
          <p>{a.sub}</p>
          <div className="auth-chips">{['Smart Locker', 'Tech Rent', 'Print Point', 'Lost & Found', 'Skill Exchange'].map((s, i) => <span key={s} style={{ animationDelay: `${i * 0.08}s` }}>{s}</span>)}</div>
        </div>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="langs">{['kz', 'ru', 'en'].map((l) => <button type="button" key={l} className={l === lang ? 'on' : ''} onClick={() => setLang(l)}>{l}</button>)}</div>
        </div>
        <div>
          <h2 className="h2">{mode === 'login' ? a.welcome : a.register}</h2>
          <p className="muted" style={{ marginTop: 4 }}>{a.sub}</p>
        </div>
        <div className="seg">
          <button type="button" className={mode === 'login' ? 'on' : ''} onClick={() => setMode('login')}>{a.login}</button>
          <button type="button" className={mode === 'register' ? 'on' : ''} onClick={() => setMode('register')}>{a.register}</button>
        </div>
        {mode === 'register' && <input className="field" placeholder={a.name} autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}
        <input className="field" type="email" placeholder={a.email} autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className="field" type="password" placeholder={`${a.password} · ${a.pwHint}`} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        {err && <div className="err">{err}</div>}
        <button className="btn solid block" disabled={busy}>{busy ? <span className="spinner" /> : mode === 'login' ? a.login : a.register}</button>
        {!isNativeApp && <>
        <div className="or"><span>or</span></div>
        <button type="button" className="btn block google" onClick={google}>
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" /><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" /></svg>
          {a.google}
        </button></>}
        <p className="muted" style={{ textAlign: 'center', fontSize: 14 }}>
          {mode === 'login' ? a.noAcc : a.haveAcc}{' '}
          <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? a.register : a.login}</button>
        </p>
      </form>
    </div>
  )
}
