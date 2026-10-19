import { useEffect, useRef } from 'react'

// Red hexagonal de grafeno con "electrones" que saltan entre átomos vecinos.
export default function GrapheneField({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: -9999, y: -9999 }
    let nodes = []
    let edges = []
    let adj = []
    let electrons = []
    let w = 0
    let h = 0
    let raf = 0

    function build() {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const a = w < 640 ? 26 : 34
      const dx = Math.sqrt(3) * a
      const dy = 1.5 * a
      const index = new Map()
      const seen = new Set()
      nodes = []
      edges = []

      const idOf = (x, y) => {
        const key = `${Math.round(x * 2)},${Math.round(y * 2)}`
        let i = index.get(key)
        if (i === undefined) {
          i = nodes.length
          index.set(key, i)
          nodes.push({ x, y, phase: Math.random() * Math.PI * 2 })
        }
        return i
      }

      for (let row = -1; row * dy < h + 2 * a; row++) {
        for (let col = -1; col * dx < w + 2 * dx; col++) {
          const cx = col * dx + (row & 1 ? dx / 2 : 0)
          const cy = row * dy
          const ids = []
          for (let k = 0; k < 6; k++) {
            const ang = (Math.PI / 180) * (60 * k + 30)
            ids.push(idOf(cx + a * Math.cos(ang), cy + a * Math.sin(ang)))
          }
          for (let k = 0; k < 6; k++) {
            const i = ids[k]
            const j = ids[(k + 1) % 6]
            const key = i < j ? `${i}-${j}` : `${j}-${i}`
            if (!seen.has(key)) {
              seen.add(key)
              edges.push([i, j])
            }
          }
        }
      }

      adj = nodes.map(() => [])
      for (const [i, j] of edges) {
        adj[i].push(j)
        adj[j].push(i)
      }

      const count = Math.max(8, Math.round(w / 55))
      electrons = Array.from({ length: count }, (_, n) => {
        const from = Math.floor(Math.random() * nodes.length)
        const to = adj[from][Math.floor(Math.random() * adj[from].length)]
        return { from, to, prev: from, t: Math.random(), speed: 0.012 + Math.random() * 0.014, red: n % 4 === 0 }
      })
    }

    function position(node, time) {
      return {
        x: node.x + Math.sin(time * 0.0009 + node.phase) * 1.6,
        y: node.y + Math.cos(time * 0.0011 + node.phase) * 1.6,
      }
    }

    function draw(time) {
      ctx.clearRect(0, 0, w, h)
      const pos = nodes.map((n) => position(n, time))

      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(122, 167, 255, 0.3)'
      ctx.beginPath()
      for (const [i, j] of edges) {
        ctx.moveTo(pos[i].x, pos[i].y)
        ctx.lineTo(pos[j].x, pos[j].y)
      }
      ctx.stroke()

      for (const p of pos) {
        const d = Math.hypot(p.x - pointer.x, p.y - pointer.y)
        const near = Math.max(0, 1 - d / 130)
        ctx.fillStyle = `rgba(170, 200, 255, ${0.5 + near * 0.5})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.6 + near * 2, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const e of electrons) {
        const a = pos[e.from]
        const b = pos[e.to]
        const x = a.x + (b.x - a.x) * e.t
        const y = a.y + (b.y - a.y) * e.t
        const color = e.red ? '255, 92, 116' : '120, 190, 255'
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 9)
        glow.addColorStop(0, `rgba(${color}, 0.9)`)
        glow.addColorStop(1, `rgba(${color}, 0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, 9, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fill()

        e.t += e.speed
        if (e.t >= 1) {
          // salta a un vecino distinto del átomo del que viene
          const options = adj[e.to].filter((n) => n !== e.from)
          const next = options.length ? options[Math.floor(Math.random() * options.length)] : e.from
          e.prev = e.from
          e.from = e.to
          e.to = next
          e.t = 0
        }
      }
    }

    function loop(time) {
      draw(time)
      raf = requestAnimationFrame(loop)
    }

    function onMove(ev) {
      const rect = canvas.getBoundingClientRect()
      pointer.x = ev.clientX - rect.left
      pointer.y = ev.clientY - rect.top
    }
    function onLeave() {
      pointer.x = -9999
      pointer.y = -9999
    }

    build()
    if (reduce) draw(0)
    else raf = requestAnimationFrame(loop)

    const observer = new ResizeObserver(() => {
      build()
      if (reduce) draw(0)
    })
    observer.observe(canvas)
    const host = canvas.parentElement
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 h-full w-full ${className}`} />
}
