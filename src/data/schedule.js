// Cronograma de mantenimiento del LMC (Myriam y Kevin), generado desde
// Cronograma_LMC_Myriam_Kevin.xlsx. Cada actividad trae `grid`: quién la
// hace en cada una de las 26 semanas ('M', 'K', 'M/K' o '' si no toca).
import data from './cronograma.json'
import { parseDate, todayISO } from '../utils/date.js'

export const schedule = data

export const PEOPLE = {
  M: { name: 'Myriam', chip: 'bg-blue-50 text-epn-blue', dot: 'bg-epn-blue' },
  K: { name: 'Kevin', chip: 'bg-violet-50 text-violet-700', dot: 'bg-violet-500' },
  'M/K': { name: 'Ambos', chip: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
}

// La app muestra solo la sección de mantenimiento del cronograma
const activities = data.activities.filter((a) => a.section === 'Mantenimiento')

// Actividades sin semana asignada: puntuales o por definir
export const unscheduled = activities.filter((a) => a.grid.every((g) => !g))

// Semana del cronograma (1–26) que corresponde a hoy; fuera del periodo se ajusta al extremo
export function currentWeek() {
  const days = Math.floor((parseDate(todayISO()) - parseDate(data.start)) / 86400000)
  return Math.min(data.weeks.length, Math.max(1, Math.floor(days / 7) + 1))
}

export function inPeriod() {
  const today = todayISO()
  return today >= data.start && today <= data.end
}

// Actividades de una semana, con la persona asignada en `who`
export function weekTasks(week) {
  return activities
    .map((a) => ({ ...a, who: a.grid[week - 1] }))
    .filter((a) => a.who)
}

// filter: 'todos' | 'M' | 'K' | 'M/K'. Las conjuntas cuentan para ambos.
export function matchesPerson(task, filter) {
  if (filter === 'todos') return true
  if (filter === 'M/K') return task.who === 'M/K'
  return task.who.includes(filter)
}

export function weekRange(week) {
  const monday = parseDate(data.weeks[week - 1].monday)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = (d, opts) => d.toLocaleDateString('es-EC', opts).replace('.', '')
  const sameMonth = monday.getMonth() === sunday.getMonth()
  return `${fmt(monday, sameMonth ? { day: 'numeric' } : { day: 'numeric', month: 'short' })} – ${fmt(sunday, { day: 'numeric', month: 'short' })}`
}

export const doneKey = (week, no) => `${week}-${no}`
