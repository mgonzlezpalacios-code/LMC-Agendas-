import { motion } from 'framer-motion'
import { BookOpenText, CalendarDays, LayoutDashboard, Megaphone, Sparkles, Wrench } from 'lucide-react'
import { LAB } from '../data/mock.js'

export const NAV = [
  { id: 'inicio', label: 'Inicio', long: 'Inicio', icon: LayoutDashboard },
  { id: 'mantenimiento', label: 'Tareas', long: 'Mantenimiento', icon: Wrench },
  { id: 'bitacora', label: 'Bitácora', long: 'Bitácora de laboratorio', icon: BookOpenText },
  { id: 'agenda', label: 'Agenda', long: 'Agenda', icon: CalendarDays },
  { id: 'noticias', label: 'Noticias', long: 'Noticias', icon: Megaphone },
  { id: 'datos', label: 'Datos', long: 'Datos curiosos', icon: Sparkles },
]

export function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <polygon points="24,8 38,16 38,32 24,40 10,32 10,16" fill="none" stroke="#4f8dff" strokeWidth="2" strokeLinejoin="round" />
      {[[24, 8], [38, 32], [10, 32]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="3.2" fill="#fff" />)}
      {[[38, 16], [24, 40], [10, 16]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="3.2" fill="#d81e3a" />)}
    </svg>
  )
}

export function Sidebar({ page, onNavigate }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-navy-900 text-white lg:flex">
      <div className="flex items-center gap-3 px-6 pb-6 pt-7">
        <Logo />
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight">Materia Condensada</p>
          <p className="text-xs text-white/50">Escuela Politécnica Nacional</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Secciones">
        {NAV.map(({ id, long, icon: Icon }) => {
          const active = page === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              aria-current={active ? 'page' : undefined}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                active ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-white/10"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              {active && <motion.span layoutId="sidebar-bar" className="absolute left-0 top-2 h-[calc(100%-1rem)] w-1 rounded-full bg-epn-red" />}
              <Icon size={18} className="relative transition-transform duration-200 group-hover:scale-110" />
              <span className="relative">{long}</span>
            </button>
          )
        })}
      </nav>

      <div className="m-3 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/55">
        <p className="font-semibold text-white/80">{LAB.short} · EPN</p>
        <p className="mt-1">{LAB.city}</p>
      </div>
    </aside>
  )
}

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-navy-900 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] text-white lg:hidden">
      <Logo size={30} />
      <div className="leading-tight">
        <p className="text-sm font-bold">Materia Condensada</p>
        <p className="text-[11px] text-white/50">Escuela Politécnica Nacional</p>
      </div>
    </header>
  )
}

export function BottomNav({ page, onNavigate }) {
  return (
    <nav
      aria-label="Secciones"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-6">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = page === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex select-none flex-col items-center gap-1 pb-2 pt-2.5 text-[10px] font-medium transition-colors ${
                active ? 'text-epn-blue' : 'text-slate-500'
              }`}
            >
              {active && <motion.span layoutId="bottom-active" className="absolute top-0 h-0.5 w-8 rounded-full bg-epn-red" />}
              <motion.span whileTap={{ scale: 0.85 }}>
                <Icon size={21} strokeWidth={active ? 2.3 : 1.9} />
              </motion.span>
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
