import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Trash2, X } from 'lucide-react'

export const ease = [0.22, 1, 0.36, 1]

// Entrada escalonada para elementos de una lista: {...fadeUp(i)}
export const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease, delay: i * 0.05 },
})

export function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-epn-red">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">{title}</h1>
      </div>
      {children}
    </header>
  )
}

export function ProgressBar({ value, className = 'bg-epn-blue' }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        className={`h-full rounded-full ${className}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease }}
      />
    </div>
  )
}

// Selector segmentado con indicador animado
export function Segmented({ id, options, value, onChange }) {
  return (
    <div className="no-scrollbar -mx-1 flex max-w-full gap-1 overflow-x-auto px-1 py-1" role="tablist">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`relative shrink-0 select-none rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
              active ? 'text-white' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-full bg-navy-900"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">
              {o.label}
              {o.count !== undefined && <span className={`ml-1.5 text-xs ${active ? 'text-white/60' : 'text-slate-400'}`}>{o.count}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl sm:max-w-xl sm:rounded-3xl sm:p-7"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="text-lg font-bold leading-snug text-navy-900">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy-900"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Botones de editar y eliminar; eliminar pide confirmación en el mismo lugar
export function ItemActions({ onEdit, onDelete, name }) {
  const [confirming, setConfirming] = useState(false)
  if (confirming) {
    return (
      <div className="flex shrink-0 items-center gap-1 rounded-full bg-red-50 p-1 text-xs font-semibold">
        <span className="pl-2 text-epn-red-dark">¿Eliminar?</span>
        <button onClick={onDelete} className="rounded-full bg-epn-red px-3 py-1.5 text-white hover:bg-epn-red-dark">Sí</button>
        <button onClick={() => setConfirming(false)} className="rounded-full px-3 py-1.5 text-slate-600 hover:bg-white">No</button>
      </div>
    )
  }
  return (
    <div className="flex shrink-0 gap-1">
      <button onClick={onEdit} aria-label={`Editar ${name}`} className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition-colors hover:bg-blue-50 hover:text-epn-blue">
        <Pencil size={16} />
      </button>
      <button onClick={() => setConfirming(true)} aria-label={`Eliminar ${name}`} className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-epn-red">
        <Trash2 size={16} />
      </button>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="card grid place-items-center px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-epn-blue">
        <Icon size={24} />
      </span>
      <p className="mt-4 text-base font-bold text-navy-900">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{text}</p>
    </div>
  )
}

export function FormActions({ onCancel, submitLabel }) {
  return (
    <div className="flex justify-end gap-2 pt-1">
      <button type="button" onClick={onCancel} className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100">
        Cancelar
      </button>
      <button type="submit" className="rounded-full bg-epn-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700 active:scale-[0.97]">
        {submitLabel}
      </button>
    </div>
  )
}

export function AddButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-epn-red px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-epn-red/20 transition-colors hover:bg-epn-red-dark active:scale-[0.97]"
    >
      {children}
    </button>
  )
}
