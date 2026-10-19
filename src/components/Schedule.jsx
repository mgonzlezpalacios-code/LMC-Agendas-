import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarOff, Check, ChevronDown, ChevronLeft, ChevronRight, ClipboardCheck } from 'lucide-react'
import { ProgressBar, Segmented, ease } from './ui.jsx'
import { PEOPLE, currentWeek, doneKey, matchesPerson, schedule, unscheduled, weekRange, weekTasks } from '../data/schedule.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { formatDate } from '../utils/date.js'

function WeekStrip({ week, today, onSelect }) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [week])

  return (
    <div ref={ref} className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 py-1">
      {schedule.weeks.map((w) => {
        const active = w.n === week
        return (
          <button
            key={w.n}
            onClick={() => onSelect(w.n)}
            aria-current={active}
            aria-label={`Semana ${w.n}`}
            className={`relative grid h-10 w-10 shrink-0 select-none place-items-center rounded-xl text-sm font-semibold tabular-nums transition-colors ${
              active ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {w.n}
            {w.n === today && <span className={`absolute bottom-1 h-1 w-1 rounded-full ${active ? 'bg-white' : 'bg-epn-red'}`} />}
            {w.holiday && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-400" />}
          </button>
        )
      })}
    </div>
  )
}

function TaskRow({ task, done, onToggle }) {
  const person = PEOPLE[task.who]
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease }}
    >
      <button
        onClick={onToggle}
        aria-pressed={done}
        className="group flex w-full select-none items-start gap-3 rounded-xl border border-slate-100 bg-white p-3 text-left transition-colors hover:border-slate-200 hover:bg-slate-50"
      >
        <span
          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${
            done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent group-hover:border-epn-blue'
          }`}
        >
          <motion.span initial={false} animate={{ scale: done ? 1 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}>
            <Check size={14} strokeWidth={3} />
          </motion.span>
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-sm font-semibold leading-snug transition-colors ${done ? 'text-slate-400 line-through' : 'text-navy-900'}`}>
            {task.equipment}
          </span>
          <span className={`block text-sm leading-snug ${done ? 'text-slate-400' : 'text-slate-600'}`}>{task.activity}</span>
          <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-500">
            {task.frequency !== '—' && <span className="rounded-md bg-slate-100 px-1.5 py-0.5">{task.frequency}</span>}
            {task.product && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5">
                <ClipboardCheck size={11} /> {task.product}
              </span>
            )}
          </span>
          {task.note && <span className="mt-1.5 block text-xs leading-snug text-slate-400">{task.note}</span>}
        </span>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${person.chip}`}>{person.name}</span>
      </button>
    </motion.li>
  )
}

export default function Schedule() {
  const today = currentWeek()
  const [week, setWeek] = useState(today)
  const [who, setWho] = useState('todos')
  const [done, setDone] = useLocalStorage('lmc.cronograma.done', {})
  const [showOther, setShowOther] = useState(false)

  const info = schedule.weeks[week - 1]
  const all = weekTasks(week)
  const tasks = all.filter((t) => matchesPerson(t, who))
  const doneCount = tasks.filter((t) => done[doneKey(week, t.no)]).length
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0

  const toggle = (no) =>
    setDone((d) => {
      const key = doneKey(week, no)
      const next = { ...d }
      if (next[key]) delete next[key]
      else next[key] = true
      return next
    })

  const count = (f) => all.filter((t) => matchesPerson(t, f)).length

  return (
    <section className="card p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-navy-900">Cronograma de mantenimiento</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Myriam y Kevin · {formatDate(schedule.start, { day: 'numeric', month: 'short' })} – {formatDate(schedule.end)}
          </p>
        </div>
        {week !== today && (
          <button onClick={() => setWeek(today)} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-epn-blue transition-colors hover:bg-blue-100">
            Ir a la semana actual
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl bg-navy-900 p-2 text-white">
        <button
          onClick={() => setWeek((w) => Math.max(1, w - 1))}
          disabled={week === 1}
          aria-label="Semana anterior"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="min-w-0 text-center">
          <p className="text-base font-bold leading-tight">
            Semana {week}
            {week === today && <span className="ml-2 rounded-full bg-epn-red px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide">Actual</span>}
          </p>
          <p className="text-xs text-white/60">{weekRange(week)}</p>
        </div>
        <button
          onClick={() => setWeek((w) => Math.min(schedule.weeks.length, w + 1))}
          disabled={week === schedule.weeks.length}
          aria-label="Semana siguiente"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-3">
        <WeekStrip week={week} today={today} onSelect={setWeek} />
      </div>

      {info.holiday && (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
          <CalendarOff size={15} className="shrink-0" /> Feriado probable esta semana: {info.holiday}
        </p>
      )}

      <div className="mt-3">
        <Segmented
          id="who"
          value={who}
          onChange={setWho}
          options={[
            { value: 'todos', label: 'Todos', count: count('todos') },
            { value: 'M', label: 'Myriam', count: count('M') },
            { value: 'K', label: 'Kevin', count: count('K') },
            { value: 'M/K', label: 'En conjunto', count: count('M/K') },
          ]}
        />
      </div>

      <div className="mt-2 flex items-center gap-3">
        <ProgressBar value={percent} className="bg-emerald-500" />
        <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-500">
          {doneCount} de {tasks.length} hechas
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className="mt-4 rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">No hay tareas de mantenimiento con este filtro en la semana {week}.</p>
      ) : (
        <ul className="mt-4 grid gap-2 lg:grid-cols-2">
          <AnimatePresence initial={false}>
            {tasks.map((t) => (
              <TaskRow key={t.no} task={t} done={!!done[doneKey(week, t.no)]} onToggle={() => toggle(t.no)} />
            ))}
          </AnimatePresence>
        </ul>
      )}

      <div className="mt-6 border-t border-slate-100 pt-4">
        <button
          onClick={() => setShowOther((v) => !v)}
          aria-expanded={showOther}
          className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-slate-600 hover:text-navy-900"
        >
          Sin fecha programada: puntuales o por definir ({unscheduled.length})
          <motion.span animate={{ rotate: showOther ? 180 : 0 }}>
            <ChevronDown size={18} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {showOther && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              className="overflow-hidden"
            >
              {unscheduled.map((a) => (
                <li key={a.no} className="mt-2 rounded-xl bg-slate-50 p-3 text-sm">
                  <p className="font-semibold text-navy-900">
                    {a.equipment} <span className="font-normal text-slate-600">· {a.activity}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Responsable: {PEOPLE[a.lead]?.name ?? a.lead} · {a.mode}
                    {a.note ? ` · ${a.note}` : ''}
                  </p>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        Las actividades en conjunto cuentan para ambos. Los feriados pueden moverse por decreto; verifícalos antes de programar. Las tareas marcadas se guardan solo en este dispositivo.
      </p>
    </section>
  )
}
