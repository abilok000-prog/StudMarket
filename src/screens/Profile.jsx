import { Avatar } from '../components/Avatar.jsx'
import { Langs } from '../components/Langs.jsx'
import { ThemePicker } from '../components/ThemePicker.jsx'
import { useApp } from '../context/AppContext.js'
import { A } from '../i18n/auth.js'
import { O } from '../i18n/ops.js'
import { Admin } from './admin/Admin.jsx'

/* ───────── Profile / Admin ───────── */
export function Profile() {
  const { t, lang, staff, orders, go, profile, setEditing, onSignOut, myReq, setReqOpen } = useApp()
  const a = A[lang]
  return (
    <>
      <div className="profile-top">
        <Avatar profile={profile} size={84} />
        <div style={{ flex: 1 }}>
          <span className="kicker">{t.profile.student}{profile.student_id ? ` · ID ${profile.student_id}` : ''}</span>
          <h1 className="h2" style={{ marginTop: 4 }}>{profile.full_name}</h1>
          <p className="muted" style={{ marginTop: 2 }}>{[profile.university, profile.faculty, profile.course && `${profile.course} ${lang === 'en' ? 'year' : 'курс'}`].filter(Boolean).join(' · ')}</p>
          {profile.bio && <p style={{ marginTop: 8, fontSize: 14, color: 'var(--ink-2)' }}>{profile.bio}</p>}
        </div>
      </div>
      <button className="btn block" style={{ marginBottom: 16 }} onClick={() => setEditing(true)}>✎ {a.edit}</button>
      {profile.interests?.length > 0 && <div className="chips" style={{ marginBottom: 16 }}>{profile.interests.map((i) => <span key={i} className="chip-on">{i}</span>)}</div>}
      <div className="kv-group">
        <div className="kv"><span>{t.nav.orders}</span><button className="mono" onClick={() => go('orders')}>{orders.length} →</button></div>
        {profile.phone && <div className="kv"><span>{a.phone}</span><span className="muted">{profile.phone}</span></div>}
        <div className="kv"><span>{t.profile.lang}</span><Langs /></div>
        <div className="kv"><span>Тема · Theme</span><div style={{ width: 200 }}><ThemePicker /></div></div>
      </div>
      <div className="kv-group">
        <div className="kv"><span>{t.profile.role}</span>
          <span className="role-row">
            <span className={`pill ${staff ? 'role-admin' : 'confirmed'}`}>{staff ? `🛡 ${O[lang].admin}` : `🎓 ${t.profile.student}`}</span>
            {!staff && (myReq?.status === 'pending'
              ? <span className="pill pending">⏳ {O[lang].pendingReq}</span>
              : <button className="pill role-ask" onClick={() => setReqOpen(true)}>{myReq?.status === 'rejected' ? `↻ ${O[lang].tryAgain}` : `🛡 ${O[lang].becomeAdmin}`}</button>)}
          </span>
        </div>
        {!staff && myReq?.status === 'rejected' && <div className="kv"><span className="muted" style={{ fontSize: 13 }}>{O[lang].rejectedReq}</span><span className="pill cancelled">✕</span></div>}
        {staff && <div className="kv"><span>{t.nav.admin}</span><button className="btn sm" onClick={() => go('admin')}>{t.open} →</button></div>}
        <div className="kv"><button style={{ color: '#ef4444', fontWeight: 600 }} onClick={onSignOut}>{a.logout}</button><span className="muted">v2.1</span></div>
      </div>
    </>
  )
}
