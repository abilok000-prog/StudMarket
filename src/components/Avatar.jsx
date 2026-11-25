import { AVATAR_COLORS } from '../data/profileOptions.js'

/* ───── Avatar ───── */
export function Avatar({ profile, size = 72 }) {
  const style = { width: size, height: size, fontSize: size * 0.45, background: AVATAR_COLORS[profile?.avatar_color] || AVATAR_COLORS.aurora }
  if (profile?.avatar_url) return <span className="avatar" style={{ ...style, backgroundImage: `url(${profile.avatar_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
  return <span className="avatar" style={style}>{profile?.avatar_emoji || (profile?.full_name || '?').trim()[0]?.toUpperCase()}</span>
}
