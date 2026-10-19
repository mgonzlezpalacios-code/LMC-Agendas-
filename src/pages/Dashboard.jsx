import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpenText, CalendarDays, ListChecks, Megaphone, Sparkles } from 'lucide-react'
import GrapheneField from '../components/GrapheneField.jsx'
import { fadeUp } from '../components/ui.jsx'
import { EVENT_TYPES, LAB, NOTE_TYPES, facts, initialEvents, initialNews, initialNotes } from '../data/mock.js'
import { PEOPLE, currentWeek, doneKey, weekRange, weekTasks } from '../data/schedule.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { dayOfMonth, formatDate, isPast, monthShort, todayISO } from '../utils/date.js'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

const KIND_COLOR = {
  nota: 'bg-epn-blue',
  noticia: 'bg-epn-red',
}

export default function Dashboard({ onNavigate }) {
  const [done] = useLocalStorage('lmc.cronograma.done', {})
  const [notes] = useLocalStorage('lmc.notes', initialNotes)
  const fact = useMemo(() => facts[Math.floor(Math.random() * facts.length)], [])

  const [news] = useLocalStorage('lmc.news', initialNews)
  const [events] = useLocalStorage('lmc.events', initialEvents)

  const week = currentWeek()
  const pending = weekTasks(week).filter((t) => !done[doneKey(week, t.no)])
  const upcoming = events.filter((e) => !isPast(e.date)).sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
  const nextEvent = upcoming[0]

  // Actividad reciente: lo último registrado en la bitácora y en noticias
  const activity = [
    ...notes.map((n) => ({ id: n.id, kind: 'nota', date: n.date, label: (NOTE_TYPES[n.type] ?? NOTE_TYPES.apunte).label, title: n.title, to: 'bitacora' })),
    ...news.map((n) => ({ id: n.id, kind: 'noticia', date: n.date, label: 'Noticia', title: n.title, to: 'noticias' })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)

  const stats = [
    { label: 'Tareas de la semana', value: pending.length, icon: ListChecks, to: 'mantenimiento' },
    { label: 'Notas en bitácora', value: notes.length, icon: BookOpenText, to: 'bitacora' },
    { label: 'Próximos eventos', value: upcoming.length, icon: CalendarDays, to: 'agenda' },
    { label: 'Noticias', value: news.length, icon: Megaphone, to: 'noticias' },
  ]

  return (
    <div className="space-y-6">
      <section className="relative isolate overflow-hidden rounded-3xl bg-navy-900 text-white">
        <GrapheneField />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/60 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-epn-red/25 blur-3xl" />
        <div className="relative px-6 py-9 sm:px-10 sm:py-14">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.16em] text-epn-sky"
          >
            {formatDate(todayISO(), { weekday: 'long', day: 'numeric', month: 'long' })}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-3 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
          >
            {greeting()}.<br />
            <span className="text-white/70">{LAB.name}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 max-w-md text-sm leading-relaxed text-white/60"
          >
            Grafeno, nanomateriales y sistemas de baja dimensión en la {LAB.institution}.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <button
              onClick={() => onNavigate('bitacora')}
              className="inline-flex items-center gap-2 rounded-full bg-epn-red px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-epn-red-dark active:scale-[0.97]"
            >
              Nueva nota <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('mantenimiento')}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/15 active:scale-[0.97]"
            >
              Tareas de mantenimiento
            </button>
          </motion.div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, to }, i) => (
          <motion.button
            key={label}
            {...fadeUp(i)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(to)}
            className="card p-4 text-left transition-shadow hover:shadow-lg hover:shadow-navy-800/5 sm:p-5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-epn-blue">
              <Icon size={18} />
            </span>
            <p className="mt-3 text-3xl font-bold tabular-nums text-navy-900">{value}</p>
            <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
          </motion.button>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="card p-5 sm:p-6 lg:col-span-3">
          <h2 className="text-base font-bold text-navy-900">Actividad reciente</h2>
          {activity.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Todavía no hay notas ni noticias registradas.</p>
          ) : (
            <ol className="mt-4">
              {activity.map((a, i) => (
                <motion.li key={`${a.kind}-${a.id}`} {...fadeUp(i)} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < activity.length - 1 && <span className="absolute left-[5px] top-4 h-full w-px bg-slate-200" />}
                  <span className={`relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full ring-4 ring-white ${KIND_COLOR[a.kind]}`} />
                  <button onClick={() => onNavigate(a.to)} className="min-w-0 text-left">
                    <p className="break-words text-sm font-semibold leading-snug text-navy-900 hover:text-epn-blue">{a.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{a.label} · {formatDate(a.date)}</p>
                  </button>
                </motion.li>
              ))}
            </ol>
          )}
        </section>

        <div className="space-y-6 lg:col-span-2">
          <button onClick={() => onNavigate('agenda')} className="card block w-full p-5 text-left transition-shadow hover:shadow-lg hover:shadow-navy-800/5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Próximo en la agenda</p>
            {nextEvent ? (
              <div className="mt-3 flex items-center gap-4">
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white ${(EVENT_TYPES[nextEvent.type] ?? EVENT_TYPES.evento).block}`}>
                  <div className="text-center leading-none">
                    <p className="text-lg font-bold">{dayOfMonth(nextEvent.date)}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/75">{monthShort(nextEvent.date)}</p>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-navy-900">{nextEvent.title}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {[(EVENT_TYPES[nextEvent.type] ?? EVENT_TYPES.evento).label, nextEvent.time, nextEvent.place].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No hay eventos próximos. Toca para agregar uno.</p>
            )}
          </button>

          <button
            onClick={() => onNavigate('datos')}
            className="group block w-full rounded-2xl bg-gradient-to-br from-epn-blue to-navy-800 p-5 text-left text-white transition-transform hover:-translate-y-0.5 active:scale-[0.99] sm:p-6"
          >
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70">
              <Sparkles size={14} /> Sabías que…
            </p>
            <p className="mt-2 text-sm font-semibold">{fact.title}</p>
            <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-white/75">{fact.text}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/90">
              Más datos <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>

      <section className="card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-navy-900">Mantenimiento · semana {week}</h2>
            <p className="text-xs text-slate-500">{weekRange(week)} · {pending.length} por hacer</p>
          </div>
          <button onClick={() => onNavigate('mantenimiento')} className="shrink-0 text-sm font-semibold text-epn-blue hover:underline">
            Ver cronograma
          </button>
        </div>
        {pending.length === 0 ? (
          <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">Todo lo programado para esta semana está hecho.</p>
        ) : (
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {pending.slice(0, 6).map((t) => (
              <li key={t.no} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                <span className="min-w-0 text-sm">
                  <span className="font-semibold text-navy-900">{t.equipment}</span>
                  <span className="text-slate-500"> · {t.activity}</span>
                </span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${PEOPLE[t.who].chip}`}>{PEOPLE[t.who].name}</span>
              </li>
            ))}
          </ul>
        )}
        {pending.length > 6 && <p className="mt-3 text-xs text-slate-400">y {pending.length - 6} más en el cronograma</p>}
      </section>
    </div>
  )
}
