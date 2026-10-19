import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Award, ChevronLeft, ChevronRight, Shuffle, Sparkles } from 'lucide-react'
import GrapheneField from '../components/GrapheneField.jsx'
import { PageHeader, ease } from '../components/ui.jsx'
import { facts, nobel } from '../data/mock.js'

const AUTOPLAY_MS = 9000

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir * -60 }),
}

export default function Facts() {
  // Cada vez que se abre la sección empieza en un dato aleatorio
  const [[index, dir], setState] = useState(() => [Math.floor(Math.random() * facts.length), 1])
  const [paused, setPaused] = useState(false)

  const go = (step) => setState(([i]) => [(i + step + facts.length) % facts.length, step >= 0 ? 1 : -1])
  const random = () =>
    setState(([i]) => {
      let next = i
      while (next === i) next = Math.floor(Math.random() * facts.length)
      return [next, 1]
    })

  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => go(1), AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [index, paused])

  const fact = facts[index]

  return (
    <div>
      <PageHeader eyebrow="Nanomateriales" title="Datos curiosos" />

      <section
        className="relative isolate overflow-hidden rounded-3xl bg-navy-900 text-white"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <GrapheneField className="opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-900/40 via-navy-900/80 to-navy-900" />

        <div className="relative px-6 py-10 sm:px-12 sm:py-14">
          <p className="flex items-center gap-2 text-sm font-semibold text-epn-sky">
            <Sparkles size={16} /> ¿Sabías que…?
          </p>

          <div className="mt-5 min-h-[17rem] sm:min-h-[13rem]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={index}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1)
                  else if (info.offset.x > 60) go(-1)
                }}
                className="cursor-grab touch-pan-y select-none active:cursor-grabbing"
              >
                <p className="font-mono text-sm text-white/40">
                  {String(index + 1).padStart(2, '0')} / {String(facts.length).padStart(2, '0')}
                </p>
                <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight sm:text-4xl">{fact.title}</h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{fact.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button onClick={() => go(-1)} aria-label="Dato anterior" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10 active:scale-95">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => go(1)} aria-label="Dato siguiente" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10 active:scale-95">
                <ChevronRight size={20} />
              </button>
              <button onClick={random} className="ml-1 inline-flex h-11 items-center gap-2 rounded-full bg-epn-red px-5 text-sm font-semibold transition-colors hover:bg-epn-red-dark active:scale-95">
                <Shuffle size={16} /> Aleatorio
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {facts.map((f, i) => (
                <button
                  key={f.title}
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  aria-label={`Ir al dato ${i + 1}`}
                  aria-current={i === index}
                  className="grid h-6 place-items-center"
                >
                  <motion.span
                    className="block h-1.5 rounded-full"
                    animate={{ width: i === index ? 22 : 6, backgroundColor: i === index ? '#ffffff' : 'rgba(255,255,255,0.3)' }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* barra de avance del carrusel */}
        <motion.div
          key={`${index}-${paused}`}
          className="absolute bottom-0 left-0 h-0.5 bg-epn-sky"
          initial={{ width: '0%' }}
          animate={{ width: paused ? '0%' : '100%' }}
          transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: 'linear' }}
        />
      </section>

      <h2 className="mb-1 mt-9 flex items-center gap-2 text-lg font-bold text-navy-900">
        <Award size={20} className="text-amber-500" /> Premios Nobel {nobel.year}
      </h2>
      <p className="mb-3 text-sm text-slate-500">Los galardonados de este año en física, química y medicina.</p>
      <div className="grid gap-4 lg:grid-cols-3">
        {nobel.prizes.map((p, i) => (
          <motion.article
            key={p.field}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="card relative flex flex-col overflow-hidden p-5"
          >
            <span className={`absolute inset-x-0 top-0 h-1 ${p.accent}`} />
            <span className={`self-start rounded-full px-2.5 py-1 text-xs font-semibold ${p.chip}`}>{p.field}</span>
            <h3 className="mt-3 text-base font-bold leading-snug text-navy-900">{p.laureates}</h3>
            <p className="mt-0.5 text-xs leading-snug text-slate-400">{p.where}</p>
            <p className="mt-3 text-sm font-semibold text-navy-900">{p.topic}</p>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">{p.text}</p>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-epn-blue hover:underline"
            >
              Comunicado oficial <ArrowUpRight size={14} />
            </a>
          </motion.article>
        ))}
      </div>

      <h2 className="mb-3 mt-9 text-lg font-bold text-navy-900">Todos los datos</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {facts.map((f, i) => (
          <motion.button
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, ease }}
            whileHover={{ y: -3 }}
            onClick={() => {
              setState([i, 1])
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className={`card p-4 text-left transition-colors ${i === index ? '!border-epn-blue' : ''}`}
          >
            <p className="font-mono text-xs text-slate-400">{String(i + 1).padStart(2, '0')}</p>
            <p className="mt-1 text-sm font-bold text-navy-900">{f.title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{f.text}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
