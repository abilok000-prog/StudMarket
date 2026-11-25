export const SERVICE_IDS = ['locker', 'tech', 'print', 'lost', 'skill']

export const LOCKER_PRICE = 300 // per hour
export const lockers = Array.from({ length: 24 }, (_, i) => {
  const row = String.fromCharCode(65 + Math.floor(i / 8))
  return { id: `${row}-${(i % 8) + 1}`, busy: [2, 5, 9, 10, 14, 19, 22].includes(i) }
})

export const techItems = [
  { id: 'mac', name: 'MacBook Air M2', spec: '8 GB · 256 GB', price: 2500 },
  { id: 'ipad', name: 'iPad 10', spec: 'Apple Pencil', price: 1500 },
  { id: 'cam', name: 'Sony ZV-E10', spec: '16–50 mm', price: 3000 },
  { id: 'calc', name: 'Casio fx-991', spec: 'Инженерлік', price: 300 },
  { id: 'mic', name: 'Rode Wireless GO', spec: '2 × TX', price: 1200 },
  { id: 'proj', name: 'Epson EF-12', spec: 'Full HD', price: 2000 },
]

export const PRINT_PRICE = { bw: 20, color: 80 }

export const seedLost = [
  { id: 1, type: 'found', title: 'Қара AirPods қабы', place: 'Кітапхана, 3-қабат', date: '24.11' },
  { id: 2, type: 'lost', title: 'Студенттік билет — Нұрлан А.', place: 'Асхана', date: '23.11' },
  { id: 3, type: 'found', title: 'Көк қолшатыр', place: 'Б корпус, 204', date: '22.11' },
  { id: 4, type: 'lost', title: 'USB-флешка 64 GB', place: 'Компьютер сыныбы', date: '21.11' },
]

export const seedSkills = [
  { id: 1, name: 'Әлия Т.', subject: 'Python', note: 'Алгоритмдер, LeetCode дайындық', price: 0 },
  { id: 2, name: 'Данияр М.', subject: 'Жоғары математика', note: 'Интеграл, қатарлар', price: 2000 },
  { id: 3, name: 'Камила С.', subject: 'IELTS Speaking', note: '7.5 балл, сөйлесу клубы', price: 1500 },
  { id: 4, name: 'Арман Ж.', subject: 'Figma / UI', note: 'Портфолио жинау', price: 0 },
]

export const promos = [
  { service: 'print', text: { kz: 'Түнгі сессияда −20%', ru: '−20% в ночную сессию', en: '−20% during finals week' }, code: 'STUDPRINT' },
  { service: 'locker', text: { kz: 'Алғашқы сағат тегін', ru: 'Первый час бесплатно', en: 'First hour free' }, code: 'FREELOCK' },
]

export const STATUS_FLOW = ['pending', 'confirmed', 'ready', 'done']
