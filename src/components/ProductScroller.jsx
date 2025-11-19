import { useEffect, useMemo, useRef, useState } from 'react'
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
      { k: 'Panel', us: 'Included', them: 'Limited' },
      { k: 'Snapshots', us: 'Yes', them: 'No' },
      { k: 'CPU', us: '2', them: '2' },
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
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const trackRef = useRef(null)

  const [dims, setDims] = useState({ vh: typeof window !== 'undefined' ? window.innerHeight : 0, maxX: 0, pinH: '120vh' })
  const prefersReduced = useRefMatchMedia('(prefers-reduced-motion: reduce)')

  useEffect(()=>{
    const recalc = () => {
      const s = sectionRef.current
      const pin = pinRef.current
      const track = trackRef.current
      if(!s || !pin || !track) return

      // Ensure track's width is measured
      const viewportW = window.innerWidth
      const vh = window.innerHeight
      // Track content natural width
      const trackW = track.scrollWidth
      const maxX = Math.max(0, trackW - viewportW)
      const pinH = `${vh + maxX}px` // amount of vertical scroll to fully slide left->right
      setDims({ vh, maxX, pinH })
    }

    recalc()
    const ro = new ResizeObserver(recalc)
    ro.observe(document.documentElement)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('load', recalc)
    window.addEventListener('orientationchange', recalc)
    window.addEventListener('resize', recalc)
    return ()=>{
      ro.disconnect()
      window.removeEventListener('load', recalc)
      window.removeEventListener('orientationchange', recalc)
      window.removeEventListener('resize', recalc)
    }
  }, [])

  useEffect(()=>{
    if (prefersReduced) return
    const onScroll = () => {
      const s = sectionRef.current
      const pin = pinRef.current
      const track = trackRef.current
      if(!s || !pin || !track) return

      const start = s.offsetTop
      const parsed = parseFloat(dims.pinH)
      const end = isNaN(parsed) ? start + Math.max(0, dims.vh) : start + (parsed - dims.vh)
      const y = window.scrollY
      const denom = Math.max(1, (end - start))
      const clamped = Math.max(0, Math.min(1, (y - start) / denom))
      const x = -clamped * dims.maxX
      if (Number.isFinite(x)) {
        track.style.transform = `translate3d(${x}px,0,0)`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return ()=>{
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [dims.pinH, dims.maxX, dims.vh, prefersReduced])

  // Touch behavior on mobile: explicitly allow vertical panning so sticky area doesn't block scroll
  // Also provide a tiny horizontal swipe assist by converting small horizontal drags to vertical scroll deltas
  useEffect(()=>{
    const pin = pinRef.current
    if (!pin) return

    // Ensure vertical panning is allowed on browsers that honor touch-action
    pin.style.touchAction = 'pan-y'

    let startX = 0
    let startY = 0
    let active = false

    const onTouchStart = (e) => {
      if (!e.touches || e.touches.length !== 1) return
      const t = e.touches[0]
      startX = t.clientX
      startY = t.clientY
      active = true
    }
    const onTouchMove = (e) => {
      if (!active || !e.touches || e.touches.length !== 1) return
      const t = e.touches[0]
      const dx = t.clientX - startX
      const dy = t.clientY - startY
      // If user swipes horizontally a lot, translate to a small vertical scroll to progress the scroller
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
        window.scrollTo({ top: window.scrollY + (dx > 0 ? -12 : 12) })
      }
    }
    const onTouchEnd = () => { active = false }

    pin.addEventListener('touchstart', onTouchStart, { passive: true })
    pin.addEventListener('touchmove', onTouchMove, { passive: true })
    pin.addEventListener('touchend', onTouchEnd)
    pin.addEventListener('touchcancel', onTouchEnd)

    return ()=>{
      pin.removeEventListener('touchstart', onTouchStart)
      pin.removeEventListener('touchmove', onTouchMove)
      pin.removeEventListener('touchend', onTouchEnd)
      pin.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [])

  return (
    <section ref={sectionRef} aria-label="Plans" className="relative mt-12" style={{ height: dims.pinH, touchAction: 'pan-y' }}>
      <div ref={pinRef} className="sticky top-0 h-screen overflow-hidden" style={{ touchAction: 'pan-y' }}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Choose your VPS</h2>
          <div className="text-sm" style={{ color: colors.muted }}>Scroll</div>
        </div>

        <div className="relative h-[calc(100svh-2.5rem)]">
          {/* Edge washes */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10" style={{
            background: 'linear-gradient(to right, color-mix(in oklab, var(--bg) 92%, transparent), transparent)'
          }}/>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10" style={{
            background: 'linear-gradient(to left, color-mix(in oklab, var(--bg) 92%, transparent), transparent)'
          }}/>

          {/* Track: horizontally long row translated by vertical scroll */}
          <div ref={trackRef} className="absolute top-0 left-0 h-full will-change-transform">
            <div className="flex h-full items-start gap-4 px-1">
              {products.map(p => (
                <article key={p.id} className="w-[300px] sm:w-[340px] md:w-[380px] flex-shrink-0">
                  <Card className="h-[calc(100%-4px)]" style={{ backgroundColor: colors.surface }}>
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
        </div>
      </div>
    </section>
  )
}

// Small hook to cache matchMedia
function useRefMatchMedia(query){
  const [match, setMatch] = useState(false)
  useEffect(()=>{
    if (!window.matchMedia) return
    const mq = window.matchMedia(query)
    const handler = (e)=> setMatch(e.matches)
    setMatch(mq.matches)
    mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler)
    return ()=> mq.removeEventListener ? mq.removeEventListener('change', handler) : mq.removeListener(handler)
  }, [query])
  return match
}
