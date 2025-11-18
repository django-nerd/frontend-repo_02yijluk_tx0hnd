import { useEffect, useRef } from 'react'
import { Card, Button, Badge } from './UI'
import { colors } from './Theme'

const products = [
  {
    id: 'nano',
    name: 'VPS Nano',
    price: '$4.99/mo',
    tag: 'Best for starters',
    specs: [
      { k: 'CPU', v: '1 vCPU' },
      { k: 'RAM', v: '1 GB' },
      { k: 'Storage', v: '20 GB NVMe' },
      { k: 'Bandwidth', v: '1 TB' },
      { k: 'Region', v: 'US/EU' },
    ],
    vs: [
      { k: 'CPU', us: '1', them: '1' },
      { k: 'NVMe speed', us: '3.5 GB/s', them: '2.5 GB/s' },
      { k: 'DDoS shield', us: 'Included', them: 'Add-on' },
    ],
    wash: 'rgba(244,114,182,0.14)'
  },
  {
    id: 'micro',
    name: 'VPS Micro',
    price: '$8.99/mo',
    tag: 'Popular pick',
    specs: [
      { k: 'CPU', v: '2 vCPU' },
      { k: 'RAM', v: '2 GB' },
      { k: 'Storage', v: '35 GB NVMe' },
      { k: 'Bandwidth', v: '2 TB' },
      { k: 'Region', v: 'US/EU/ASIA' },
    ],
    vs: [
      { k: 'CPU', us: '2', them: '2' },
      { k: 'Panel', us: 'Included', them: 'Limited' },
      { k: 'Snapshots', us: 'Yes', them: 'No' },
    ],
    wash: 'rgba(167,139,250,0.16)'
  },
  {
    id: 'pro',
    name: 'VPS Pro',
    price: '$18.00/mo',
    tag: 'For growing apps',
    specs: [
      { k: 'CPU', v: '3 vCPU' },
      { k: 'RAM', v: '4 GB' },
      { k: 'Storage', v: '80 GB NVMe' },
      { k: 'Bandwidth', v: '4 TB' },
      { k: 'Region', v: 'Global 8' },
    ],
    vs: [
      { k: 'SLA', us: '99.99%', them: '99.9%' },
      { k: 'Support', us: '24/7', them: 'Business hours' },
      { k: 'Backups', us: 'Daily', them: 'Weekly' },
    ],
    wash: 'rgba(96,165,250,0.16)'
  },
  {
    id: 'max',
    name: 'VPS Max',
    price: '$32.00/mo',
    tag: 'Performance',
    specs: [
      { k: 'CPU', v: '4 vCPU' },
      { k: 'RAM', v: '8 GB' },
      { k: 'Storage', v: '160 GB NVMe' },
      { k: 'Bandwidth', v: '6 TB' },
      { k: 'Region', v: 'Global 12' },
    ],
    vs: [
      { k: 'CPU boost', us: 'High', them: 'Medium' },
      { k: 'Network', us: '10 Gbps', them: '5 Gbps' },
      { k: 'Firewall', us: 'Advanced', them: 'Basic' },
    ],
    wash: 'rgba(251,191,36,0.16)'
  },
]

export default function ProductScroller(){
  const containerRef = useRef(null)

  useEffect(()=>{
    const el = containerRef.current
    if(!el) return

    const onWheel = (e) => {
      // Do not hijack vertical scroll. Only assist when user explicitly holds Shift for horizontal.
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return
      if (!e.shiftKey) return // require Shift to convert wheel to horizontal

      const maxLeft = el.scrollWidth - el.clientWidth
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      const next = Math.min(maxLeft, Math.max(0, el.scrollLeft + delta))
      if (next !== el.scrollLeft) {
        e.preventDefault()
        el.scrollTo({ left: next, behavior: 'auto' })
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return ()=> el.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <section aria-label="Plans" className="mt-12">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Choose your VPS</h2>
        <div className="text-sm" style={{ color: colors.muted }}>Scroll horizontally • hold Shift to scroll</div>
      </div>

      <div className="relative">
        {/* Edge washes */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10" style={{
          background: 'linear-gradient(to right, color-mix(in oklab, var(--bg) 92%, transparent), transparent)'
        }}/>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10" style={{
          background: 'linear-gradient(to left, color-mix(in oklab, var(--bg) 92%, transparent), transparent)'
        }}/>

        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          {products.map(p => (
            <article key={p.id} className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] snap-start">
              <Card className="h-full" style={{ backgroundColor: colors.surface }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{p.name}</h3>
                  <Badge>{p.tag}</Badge>
                </div>
                <div className="mt-1 text-2xl font-semibold" style={{ color: colors.text }}>{p.price}</div>

                <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  {p.specs.map(s => (
                    <li key={s.k} className="flex items-center justify-between">
                      <span style={{ color: colors.muted }}>{s.k}</span>
                      <span style={{ color: colors.text }}>{s.v}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 rounded-[12px] border p-3" style={{ borderColor: colors.border, backgroundColor: p.wash }}>
                  <div className="text-xs font-medium mb-2" style={{ color: colors.text }}>Vs others</div>
                  <div className="grid grid-cols-3 text-xs">
                    <div className="font-medium" style={{ color: colors.muted }}>Key</div>
                    <div className="font-medium" style={{ color: colors.text }}>Us</div>
                    <div className="font-medium" style={{ color: colors.text }}>Others</div>
                  </div>
                  {p.vs.map(row => (
                    <div key={row.k} className="grid grid-cols-3 text-xs py-1 border-t" style={{ borderColor: 'color-mix(in oklab, var(--border) 70%, transparent)' }}>
                      <div style={{ color: colors.muted }}>{row.k}</div>
                      <div style={{ color: colors.text }}>{row.us}</div>
                      <div style={{ color: colors.text }}>{row.them}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="candy">Get {p.name}</Button>
                  <Button variant="outline">Details</Button>
                </div>
              </Card>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
