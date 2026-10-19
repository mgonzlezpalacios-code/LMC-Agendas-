import { useCallback, useEffect, useState } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import { BottomNav, MobileHeader, NAV, Sidebar } from './components/Navigation.jsx'
import { ease } from './components/ui.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Maintenance from './pages/Maintenance.jsx'
import Notebook from './pages/Notebook.jsx'
import Agenda from './pages/Agenda.jsx'
import News from './pages/News.jsx'
import Facts from './pages/Facts.jsx'

const PAGES = {
  inicio: Dashboard,
  mantenimiento: Maintenance,
  bitacora: Notebook,
  agenda: Agenda,
  noticias: News,
  datos: Facts,
}

// Navegación por hash: funciona en GitHub Pages sin configuración de rutas.
// Direcciones de versiones anteriores de la app
const ALIASES = { experimentos: 'mantenimiento', comunicacion: 'noticias' }

function pageFromHash() {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const id = ALIASES[raw] ?? raw
  return NAV.some((n) => n.id === id) ? id : 'inicio'
}

export default function App() {
  const [page, setPage] = useState(pageFromHash)

  useEffect(() => {
    const onHash = () => setPage(pageFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((id) => {
    window.location.hash = `/${id}`
    window.scrollTo({ top: 0 })
  }, [])

  const Page = PAGES[page]

  return (
    <MotionConfig reducedMotion="user">
      <Sidebar page={page} onNavigate={navigate} />
      <div className="lg:pl-64">
        <MobileHeader />
        <main className="pb-safe-nav mx-auto max-w-6xl px-4 pt-5 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          {/* Solo animación de entrada: el cambio de sección es inmediato aunque se navegue rápido */}
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            <Page onNavigate={navigate} />
          </motion.div>
        </main>
      </div>
      <BottomNav page={page} onNavigate={navigate} />
    </MotionConfig>
  )
}
