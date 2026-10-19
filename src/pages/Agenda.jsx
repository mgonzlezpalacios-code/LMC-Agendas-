import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronDown, Clock, MapPin, Plus } from 'lucide-react'
import { AddButton, EmptyState, FormActions, ItemActions, Modal, PageHeader, Segmented, ease, fadeUp } from '../components/ui.jsx'
import { EVENT_TYPES, initialEvents } from '../data/mock.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { dayOfMonth, isPast, monthShort, parseDate, todayISO } from '../utils/date.js'

const emptyDraft = (type = 'evento') => ({ id: null, type, title: '', date: todayISO(), time: '', place: '', description: '' })

const monthLabel = (iso) => {
  const s = parseDate(iso).toLocaleDateString('es-EC', { month: 'long', year: 'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}
const weekday = (iso) => parseDate(iso).toLocaleDateString('es-EC', { weekday: 'long' })

function EventForm({ draft, onChange, onSubmit, onCancel }) {
  const set = (key) => (e) => onChange({ ...draft, [key]: e.target.value })
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <span className="label">Tipo</span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(EVENT_TYPES).map(([value, t]) => (
            <button
              key={value}
              type="button"
              aria-pressed={draft.type === value}
              onClick={() => onChange({ ...draft, type: value })}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                draft.type === value ? 'border-navy-900 bg-navy-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="ev-title">Título</label>
        <input id="ev-title" className="field" required value={draft.title} onChange={set('title')} placeholder="Ej. Visita de la Facultad de Química" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="ev-date">Fecha</label>
          <input id="ev-date" type="date" className="field" required value={draft.date} onChange={set('date')} />
        </div>
        <div>
          <label className="label" htmlFor="ev-time">Hora (opcional)</label>
          <input id="ev-time" type="time" className="field" value={draft.time} onChange={set('time')} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="ev-place">Lugar (opcional)</label>
        <input id="ev-place" className="field" value={draft.place} onChange={set('place')} />
      </div>
      <div>
        <label className="label" htmlFor="ev-desc">Detalles (opcional)</label>
        <textarea id="ev-desc" rows={3} className="field resize-y" value={draft.description} onChange={set('description')} />
      </div>
      <FormActions onCancel={onCancel} submitLabel={draft.id ? 'Guardar cambios' : 'Agregar a la agenda'} />
    </form>
  )
}

function EventCard({ event, index, onEdit, onDelete }) {
  const type = EVENT_TYPES[event.type] ?? EVENT_TYPES.evento
  const today = event.date === todayISO()
  return (
    <motion.li {...fadeUp(index)} className="card flex items-start gap-4 p-4 sm:p-5">
      <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-white ${type.block}`}>
        <div className="text-center leading-none">
          <p className="text-xl font-bold">{dayOfMonth(event.date)}</p>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-white/75">{monthShort(event.date)}</p>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className={`rounded-full px-2.5 py-0.5 ${type.chip}`}>{type.label}</span>
          {today && <span className="rounded-full bg-epn-red px-2.5 py-0.5 text-white">Hoy</span>}
          <span className="font-medium capitalize text-slate-400">{weekday(event.date)}</span>
        </p>
        <h3 className="mt-1.5 break-words text-[15px] font-bold leading-snug text-navy-900">{event.title}</h3>
        {(event.time || event.place) && (
          <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            {event.time && <span className="inline-flex items-center gap-1"><Clock size={12} /> {event.time}</span>}
            {event.place && <span className="inline-flex items-center gap-1"><MapPin size={12} /> {event.place}</span>}
          </p>
        )}
        {event.description && <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">{event.description}</p>}
      </div>
      <ItemActions name="evento" onEdit={() => onEdit(event)} onDelete={() => onDelete(event.id)} />
    </motion.li>
  )
}

export default function Agenda() {
  const [events, setEvents] = useLocalStorage('lmc.events', initialEvents)
  const [filter, setFilter] = useState('todos')
  const [showPast, setShowPast] = useState(false)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)

  const byDate = (a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || '')
  const matching = events.filter((e) => filter === 'todos' || e.type === filter)
  const upcoming = matching.filter((e) => !isPast(e.date)).sort(byDate)
  const past = matching.filter((e) => isPast(e.date)).sort((a, b) => byDate(b, a))

  // Próximos eventos agrupados por mes
  const months = []
  for (const e of upcoming) {
    const label = monthLabel(e.date)
    if (months.at(-1)?.label !== label) months.push({ label, items: [] })
    months.at(-1).items.push(e)
  }

  const startNew = () => {
    setDraft(emptyDraft(filter === 'todos' ? 'evento' : filter))
    setOpen(true)
  }
  const startEdit = (event) => {
    setDraft({ ...emptyDraft(), ...event })
    setOpen(true)
  }
  const remove = (id) => setEvents((list) => list.filter((e) => e.id !== id))
  const save = (e) => {
    e.preventDefault()
    const clean = { ...draft, title: draft.title.trim() }
    if (!clean.title) return
    setEvents((list) => (clean.id ? list.map((x) => (x.id === clean.id ? clean : x)) : [...list, { ...clean, id: `ev-${Date.now()}` }]))
    setOpen(false)
  }

  return (
    <div>
      <PageHeader eyebrow="Calendario del laboratorio" title="Agenda">
        <AddButton onClick={startNew}>
          <Plus size={16} /> Nuevo evento
        </AddButton>
      </PageHeader>

      <div className="mb-4">
        <Segmented
          id="event-type"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'todos', label: 'Todos', count: events.length },
            ...Object.entries(EVENT_TYPES).map(([value, t]) => ({ value, label: t.label, count: events.filter((e) => e.type === value).length })),
          ]}
        />
      </div>

      {upcoming.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No hay eventos próximos" text="Agrega visitas, capacitaciones, llegada de equipos u otros eventos con “Nuevo evento”." />
      ) : (
        <div className="space-y-6">
          {months.map((m) => (
            <section key={m.label}>
              <h2 className="mb-2 text-sm font-bold text-navy-900">{m.label}</h2>
              <ol className="space-y-3">
                {m.items.map((e, i) => (
                  <EventCard key={e.id} event={e} index={i} onEdit={startEdit} onDelete={remove} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="mt-8 border-t border-slate-200 pt-4">
          <button
            onClick={() => setShowPast((v) => !v)}
            aria-expanded={showPast}
            className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-600 hover:text-navy-900"
          >
            Eventos anteriores ({past.length})
            <motion.span animate={{ rotate: showPast ? 180 : 0 }}>
              <ChevronDown size={18} />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {showPast && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease }}
                className="overflow-hidden"
              >
                <ol className="space-y-3 pt-3 opacity-70">
                  {past.map((e, i) => (
                    <EventCard key={e.id} event={e} index={i} onEdit={startEdit} onDelete={remove} />
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-slate-400">Los cambios en la agenda se guardan solo en este dispositivo.</p>

      <Modal open={open} onClose={() => setOpen(false)} title={draft.id ? 'Editar evento' : 'Nuevo evento'}>
        <EventForm draft={draft} onChange={setDraft} onSubmit={save} onCancel={() => setOpen(false)} />
      </Modal>
    </div>
  )
}
