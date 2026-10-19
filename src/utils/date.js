// Las fechas se guardan como 'AAAA-MM-DD' y se interpretan en hora local.
export function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatDate(iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!iso) return ''
  return parseDate(iso).toLocaleDateString('es-EC', opts)
}

export function monthShort(iso) {
  return parseDate(iso).toLocaleDateString('es-EC', { month: 'short' }).replace('.', '')
}

export function dayOfMonth(iso) {
  return parseDate(iso).getDate()
}

export function isPast(iso) {
  return iso < todayISO()
}
