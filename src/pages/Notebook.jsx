import { forwardRef, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, NotebookPen, Plus, Search } from 'lucide-react'
import { AddButton, EmptyState, FormActions, ItemActions, Modal, PageHeader, Segmented, ease } from '../components/ui.jsx'
import { NOTE_TYPES, initialNotes } from '../data/mock.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { formatDate, todayISO } from '../utils/date.js'

const emptyDraft = (type = 'apunte') => ({ id: null, type, title: '', date: todayISO(), description: '', results: '' })

// Las etiquetas de los campos cambian según el tipo de nota
const FIELDS = {
  apunte: { description: 'Apuntes', results: 'Pendientes / conclusiones' },
  experimento: { description: 'Descripción', results: 'Resultados' },
  protocolo: { description: 'Procedimiento', results: 'Materiales y observaciones' },
}

function NoteForm({ draft, onChange, onSubmit, onCancel }) {
  const set = (key) => (e) => onChange({ ...draft, [key]: e.target.value })
  const fields = FIELDS[draft.type]
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <span className="label">Tipo</span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(NOTE_TYPES).map(([value, t]) => (
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
      <div className="grid gap-4 sm:grid-cols-[1fr_11rem]">
        <div>
          <label className="label" htmlFor="note-title">Título</label>
          <input id="note-title" className="field" required value={draft.title} onChange={set('title')} placeholder="Ej. Raman de muestra rGO-12" />
        </div>
        <div>
          <label className="label" htmlFor="note-date">Fecha</label>
          <input id="note-date" type="date" className="field" required value={draft.date} onChange={set('date')} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="note-desc">{fields.description}</label>
        <textarea id="note-desc" rows={6} className="field resize-y" value={draft.description} onChange={set('description')} />
      </div>
      <div>
        <label className="label" htmlFor="note-res">{fields.results}</label>
        <textarea id="note-res" rows={4} className="field resize-y" value={draft.results} onChange={set('results')} />
      </div>
      <FormActions onCancel={onCancel} submitLabel={draft.id ? 'Guardar cambios' : 'Guardar nota'} />
    </form>
  )
}

// forwardRef: AnimatePresence en modo popLayout necesita medir el elemento
const NoteCard = forwardRef(function NoteCard({ note, onEdit, onDelete }, ref) {
  const type = NOTE_TYPES[note.type] ?? NOTE_TYPES.apunte
  const fields = FIELDS[note.type] ?? FIELDS.apunte
  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease }}
      className="card flex flex-col p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full px-2.5 py-0.5 font-semibold ${type.chip}`}>{type.label}</span>
            <span className="font-medium text-slate-400">{formatDate(note.date)}</span>
          </p>
          <h3 className="mt-1.5 break-words text-base font-bold leading-snug text-navy-900">{note.title}</h3>
        </div>
        <ItemActions name="nota" onEdit={() => onEdit(note)} onDelete={() => onDelete(note.id)} />
      </div>

      {note.description && (
        <div className="mt-3">
          <p className="label">{fields.description}</p>
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">{note.description}</p>
        </div>
      )}
      {note.results && (
        <div className="mt-3 rounded-xl border-l-4 border-epn-blue bg-blue-50/60 p-3">
          <p className="label !text-epn-blue">{fields.results}</p>
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">{note.results}</p>
        </div>
      )}
    </motion.article>
  )
})

export default function Notebook() {
  const [notes, setNotes] = useLocalStorage('lmc.notes', initialNotes)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('todas')
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)

  const typeOf = (n) => (NOTE_TYPES[n.type] ? n.type : 'apunte')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return notes
      .filter((n) => filter === 'todas' || typeOf(n) === filter)
      .filter((n) => !q || [n.title, n.description, n.results].some((f) => (f ?? '').toLowerCase().includes(q)))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [notes, query, filter])

  const startNew = () => {
    setDraft(emptyDraft(filter === 'todas' ? 'apunte' : filter))
    setOpen(true)
  }
  const startEdit = (note) => {
    setDraft({ ...emptyDraft(), ...note, type: typeOf(note) })
    setOpen(true)
  }

  const save = (e) => {
    e.preventDefault()
    const clean = { ...draft, title: draft.title.trim() }
    if (!clean.title) return
    setNotes((list) =>
      clean.id ? list.map((n) => (n.id === clean.id ? clean : n)) : [{ ...clean, id: `note-${Date.now()}` }, ...list],
    )
    setOpen(false)
  }

  const exportNotes = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bitacora-lmc-${todayISO()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader eyebrow="Bloc de notas" title="Bitácora de laboratorio">
        <div className="flex gap-2">
          <button
            onClick={exportNotes}
            disabled={!notes.length}
            aria-label="Exportar bitácora"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-navy-900 disabled:opacity-40"
          >
            <Download size={16} /> <span className="hidden sm:inline">Exportar</span>
          </button>
          <AddButton onClick={startNew}>
            <Plus size={16} /> Nueva nota
          </AddButton>
        </div>
      </PageHeader>

      <div className="relative mb-3">
        <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en la bitácora…"
          aria-label="Buscar en la bitácora"
          className="field !rounded-full !pl-10"
        />
      </div>

      <div className="mb-4">
        <Segmented
          id="note-type"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'todas', label: 'Todas', count: notes.length },
            ...Object.entries(NOTE_TYPES).map(([value, t]) => ({ value, label: `${t.label}s`, count: notes.filter((n) => typeOf(n) === value).length })),
          ]}
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title={notes.length ? 'Sin coincidencias' : 'La bitácora está vacía'}
          text={notes.length ? 'Prueba con otro filtro o término de búsqueda.' : 'Agrega tu primer apunte, experimento o protocolo con “Nueva nota”.'}
        />
      ) : (
        <motion.div layout className="grid items-start gap-4 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((n) => (
              <NoteCard key={n.id} note={n} onEdit={startEdit} onDelete={(id) => setNotes((list) => list.filter((x) => x.id !== id))} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <p className="mt-6 text-center text-xs text-slate-400">Las notas se guardan solo en este dispositivo.</p>

      <Modal open={open} onClose={() => setOpen(false)} title={draft.id ? 'Editar nota' : 'Nueva nota'}>
        <NoteForm draft={draft} onChange={setDraft} onSubmit={save} onCancel={() => setOpen(false)} />
      </Modal>
    </div>
  )
}
