import { createAuthClient } from '@neondatabase/auth'

export const auth = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL)
const API = import.meta.env.VITE_NEON_DATA_API_URL

let cached = { token: null, exp: 0 }
async function token() {
  if (cached.token && Date.now() < cached.exp) return cached.token
  const { data, error } = await auth.token()
  const jwt = data?.token || data?.session?.token
  if (error || !jwt) throw new Error(error?.message || 'No session')
  cached = { token: jwt, exp: Date.now() + 10 * 60 * 1000 }
  return cached.token
}
export function clearToken() { cached = { token: null, exp: 0 } }

async function rest(path, { method = 'GET', body, prefer } = {}) {
  const res = await fetch(`${API}/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${await token()}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`)
  return res.status === 204 ? null : res.json()
}

export const db = {
  getProfile: async () => (await rest('profiles?select=*'))[0] || null,
  saveProfile: (p) => rest('profiles?on_conflict=user_id', {
    method: 'POST', body: { ...p, updated_at: new Date().toISOString() },
    prefer: 'resolution=merge-duplicates,return=representation',
  }).then((r) => r[0]),
  listOrders: () => rest('orders?select=*&order=created_at.desc'),
  addOrder: (o) => rest('orders', { method: 'POST', body: o, prefer: 'return=representation' }).then((r) => r[0]),
  setOrderStatus: (id, status) => rest(`orders?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body: { status } }),
  listLost: () => rest('lost_posts?select=*&order=created_at.desc'),
  addLost: (p) => rest('lost_posts', { method: 'POST', body: p, prefer: 'return=representation' }).then((r) => r[0]),
  listSkills: () => rest('skill_offers?select=*&order=created_at.desc'),
  addSkill: (s) => rest('skill_offers', { method: 'POST', body: s, prefer: 'return=representation' }).then((r) => r[0]),
}

/* Resize an image file to a small square JPEG data URL for the avatar */
export function fileToAvatar(file, size = 256) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = c.height = size
      const s = Math.min(img.width, img.height)
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size)
      resolve(c.toDataURL('image/jpeg', 0.82))
      URL.revokeObjectURL(img.src)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export function userIdFromToken(jwt) {
  try { return JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).sub } catch { return null }
}
export async function myUserId() { return userIdFromToken(await token()) }
const rpc = (fn, args) => rest(`rpc/${fn}`, { method: 'POST', body: args })

Object.assign(db, {
  isStaff: () => rpc('is_staff', {}),
  listMyOrders: (uid) => rest(`orders?select=*&user_id=eq.${encodeURIComponent(uid)}&order=created_at.desc`),
  listAllOrders: () => rest('orders?select=*&order=created_at.desc&limit=200'),
  getOrder: (id) => rest(`orders?select=*&id=eq.${encodeURIComponent(id)}`).then((r) => r[0]),
  pay: (id, method, paid) => rest(`orders?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body: { pay_method: method, pay_status: paid ? 'paid' : 'unpaid' }, prefer: 'return=representation' }).then((r) => r[0]),
  redeem: (id, secret) => rpc('redeem_order', { p_id: id, p_secret: secret ?? null }),
  staffSetStatus: (id, status) => rpc('staff_set_status', { p_id: id, p_status: status }),
  listMessages: (orderId) => rest(`messages?select=*&order_id=eq.${encodeURIComponent(orderId)}&order=created_at.asc`),
  listRecentMessages: () => rest('messages?select=id,order_id,body,sender_id,sender_name,is_staff,created_at&order=created_at.desc&limit=500'),
  listClients: () => rest('profiles?select=user_id,full_name,university,faculty,course,phone,student_id,avatar_url,avatar_color,avatar_emoji,created_at&order=created_at.desc'),
  myAdminRequest: () => rest('admin_requests?select=*&order=created_at.desc&limit=1').then((r) => r[0] || null),
  requestAdmin: (reason) => rpc('request_admin', { p_reason: reason }),
  listAdminRequests: () => rest('admin_requests?select=*&status=eq.pending&order=created_at.asc'),
  reviewAdminRequest: (id, ok) => rpc('review_admin_request', { p_id: id, p_approve: ok }),
  listStaff: () => rest('staff?select=user_id').then((r) => r.map((x) => x.user_id)),
  setStaff: (uid, make) => rpc('set_staff', { p_user: uid, p_make: make }),
  sendMessage: (m) => rest('messages', { method: 'POST', body: m, prefer: 'return=representation' }).then((r) => r[0]),
})
