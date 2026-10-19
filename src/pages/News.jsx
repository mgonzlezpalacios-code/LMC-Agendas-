import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Instagram, Megaphone, Plus } from 'lucide-react'
import { AddButton, EmptyState, FormActions, ItemActions, Modal, PageHeader, fadeUp } from '../components/ui.jsx'
import { LAB, NEWS_TAGS, initialNews } from '../data/mock.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { formatDate, todayISO } from '../utils/date.js'

const emptyDraft = () => ({ id: null, title: '', date: todayISO(), tag: NEWS_TAGS[0], body: '' })

function NewsForm({ draft, onChange, onSubmit, onCancel }) {
  const set = (key) => (e) => onChange({ ...draft, [key]: e.target.value })
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="news-title">Titular</label>
        <input id="news-title" className="field" required value={draft.title} onChange={set('title')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="news-tag">Categoría</label>
          <select id="news-tag" className="field" value={draft.tag} onChange={set('tag')}>
            {NEWS_TAGS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="news-date">Fecha</label>
          <input id="news-date" type="date" className="field" required value={draft.date} onChange={set('date')} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="news-body">Texto</label>
        <textarea id="news-body" rows={6} className="field resize-y" value={draft.body} onChange={set('body')} />
      </div>
      <FormActions onCancel={onCancel} submitLabel={draft.id ? 'Guardar cambios' : 'Publicar noticia'} />
    </form>
  )
}

function InstagramCard() {
  return (
    <motion.a
      href={LAB.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px]"
    >
      <div className="relative rounded-[calc(1.5rem-2px)] bg-navy-900 p-6 text-white">
        <motion.span
          className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
          animate={{ rotate: [0, -6, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Instagram size={28} />
        </motion.span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-white/50">Síguenos en Instagram</p>
        <p className="mt-1 break-all text-xl font-bold">{LAB.instagramHandle}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/60">Fotos del laboratorio, resultados recientes y la vida diaria del grupo.</p>
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-900 transition-transform group-hover:translate-x-1">
          Abrir perfil <ArrowUpRight size={15} />
        </span>
      </div>
    </motion.a>
  )
}

export default function News() {
  const [news, setNews] = useLocalStorage('lmc.news', initialNews)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)

  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date))

  const startNew = () => {
    setDraft(emptyDraft())
    setOpen(true)
  }
  const startEdit = (item) => {
    setDraft({ ...emptyDraft(), ...item })
    setOpen(true)
  }
  const save = (e) => {
    e.preventDefault()
    const clean = { ...draft, title: draft.title.trim() }
    if (!clean.title) return
    setNews((list) => (clean.id ? list.map((n) => (n.id === clean.id ? clean : n)) : [{ ...clean, id: `news-${Date.now()}` }, ...list]))
    setOpen(false)
  }

  return (
    <div>
      <PageHeader eyebrow="Novedades del laboratorio" title="Noticias">
        <AddButton onClick={startNew}>
          <Plus size={16} /> Nueva noticia
        </AddButton>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {sorted.length === 0 ? (
            <EmptyState icon={Megaphone} title="Aún no hay noticias" text="Publica la primera con el botón “Nueva noticia”." />
          ) : (
            sorted.map((n, i) => (
              <motion.article key={n.id} {...fadeUp(i)} className="card p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 pt-1.5 text-xs">
                    <span className="rounded-full bg-navy-900 px-2.5 py-1 font-semibold text-white">{n.tag}</span>
                    <time className="text-slate-400">{formatDate(n.date)}</time>
                  </div>
                  <ItemActions name="noticia" onEdit={() => startEdit(n)} onDelete={() => setNews((list) => list.filter((x) => x.id !== n.id))} />
                </div>
                <h3 className="mt-2 break-words text-lg font-bold leading-snug text-navy-900">{n.title}</h3>
                {n.body && <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">{n.body}</p>}
              </motion.article>
            ))
          )}
        </div>
        <aside className="lg:sticky lg:top-10 lg:self-start">
          <InstagramCard />
        </aside>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={draft.id ? 'Editar noticia' : 'Nueva noticia'}>
        <NewsForm draft={draft} onChange={setDraft} onSubmit={save} onCancel={() => setOpen(false)} />
      </Modal>
    </div>
  )
}
