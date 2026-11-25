import { useEffect } from 'react'

/* ───── Splash (intro animation) ───── */
export function Splash({ done }) {
  useEffect(() => { const id = setTimeout(done, 2300); return () => clearTimeout(id) }, [])
  return (
    <div className="splash">
      <div className="splash-orb o1" /><div className="splash-orb o2" /><div className="splash-orb o3" />
      <div className="splash-logo">S</div>
      <div className="splash-word">{'StudMarket'.split('').map((c, i) => <span key={i} style={{ animationDelay: `${0.6 + i * 0.05}s` }}>{c}</span>)}</div>
      <div className="splash-bar"><i /></div>
    </div>
  )
}
