export function Icon({ name }) {
  const p = { width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 }
  const d = {
    home: <path d="M3 10 10 4l7 6v7H3z M8 17v-5h4v5" />,
    services: <><rect x="3" y="3" width="6" height="6" /><rect x="11" y="3" width="6" height="6" /><rect x="3" y="11" width="6" height="6" /><rect x="11" y="11" width="6" height="6" /></>,
    orders: <path d="M5 2h10v16l-2.5-1.5L10 18l-2.5-1.5L5 18zM8 7h4M8 10h4" />,
    profile: <><circle cx="10" cy="7" r="3.5" /><path d="M3 18c1-4 4-5 7-5s6 1 7 5" /></>,
    admin: <><path d="M10 2 3 5v5c0 4 3 7 7 8 4-1 7-4 7-8V5z" /><path d="m7 10 2 2 4-4" /></>,
    messages: <path d="M3 4h14v10H8l-4 3v-3H3z M6.5 8h7M6.5 11h4" />,
    qr: <><rect x="2.5" y="2.5" width="5.5" height="5.5" rx="1" /><rect x="12" y="2.5" width="5.5" height="5.5" rx="1" /><rect x="2.5" y="12" width="5.5" height="5.5" rx="1" /><path d="M12 12h2v2h-2zM15.5 15.5h2v2h-2zM15.5 12h2M12 15.5v2" /></>,
  }[name]
  return <svg viewBox="0 0 20 20" {...p}>{d}</svg>
}
