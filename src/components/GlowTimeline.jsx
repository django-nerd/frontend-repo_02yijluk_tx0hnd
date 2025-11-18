import { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from './UI'
import { colors, radii } from './Theme'

/*
  GlowTimeline
  - Vertical stepped timeline for four product pillars
  - A glowing pipe/rope runs vertically and fills progressively as user scrolls the section
  - Each step fades/slides in when it comes into view
  - Respects prefers-reduced-motion
*/
export default function GlowTimeline(){
  const containerRef = useRef(null)
  const progressRef = useRef(0)
  const reduceMotion = useRef(false)
  const [visibleSteps, setVisibleSteps] = useState([false, false, false, false])

  const steps = useMemo(()=>[
    { title: 'Blazing VPS', desc: 'SSD NVMe, global regions, instant provision' },
    { title: 'Domains', desc: 'Simple search, WHOIS privacy, easy DNS' },
    { title: 'Panels', desc: 'Game & web panels with refined UX' },
    { title: 'Auto Payment', desc: 'Seamless capture, retries, fraud guard' },
  ], [])

  useEffect(()=>{
    reduceMotion.current = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Track section scroll progress to drive glowing pipe fill
    const onScroll = () => {
      const el = containerRef.current
      if(!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // progress from when top enters viewport to when bottom leaves
      const total = rect.height + vh
      const y = vh - rect.top
      const p = Math.min(1, Math.max(0, y / total))
      progressRef.current = p
      el.style.setProperty('--progress', String(p))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return ()=>{
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(()=>{
    // Reveal steps one-by-one when intersecting
    const els = Array.from(document.querySelectorAll('[data-timeline-step]'))
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        const idxAttr = entry.target.getAttribute('data-index')
        const idx = Number(idxAttr)
        if(entry.isIntersecting){
          setVisibleSteps(prev => {
            if(prev[idx]) return prev
            const next = [...prev]
            next[idx] = true
            return next
          })
        }
      })
    }, { rootMargin: '0px 0px -20% 0px', threshold: 0.3 })

    els.forEach(el => io.observe(el))
    return ()=> io.disconnect()
  }, [])

  return (
    <section ref={containerRef} aria-label="Highlights" className="mt-14">
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: colors.text }}>Why people pick Nimbus</h2>
        <p className="text-sm md:text-base mt-1" style={{ color: colors.muted }}>A stepped showcase with a glowing path that follows your scroll.</p>
      </div>

      <div className="relative grid grid-cols-[28px_1fr] md:grid-cols-[40px_1fr] gap-x-4 md:gap-x-6">
        {/* Glowing pipe */}
        <div className="relative" aria-hidden>
          {/* Track */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[6px] md:w-[8px] rounded-full"
            style={{
              background: 'linear-gradient(180deg, rgba(167,139,250,0.25), rgba(244,114,182,0.25))',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)'
            }}
          />
          {/* Fill (masked by progress) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[6px] md:w-[8px] rounded-full"
            style={{
              height: 'calc((var(--progress, 0) * 100%))',
              background: 'linear-gradient(180deg, #F472B6 0%, #A78BFA 35%, #60A5FA 100%)',
              boxShadow: '0 0 16px rgba(167,139,250,0.55), 0 0 30px rgba(244,114,182,0.35)',
              transition: reduceMotion.current ? undefined : 'height 120ms ease-out'
            }}
          />
          {/* Spark at the end of fill */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: 'calc((var(--progress, 0) * 100%) - 8px)',
              width: 18, height: 18, borderRadius: 9999,
              background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(244,114,182,0.55) 45%, rgba(167,139,250,0.0) 70%)',
              filter: 'blur(0.5px)',
              opacity: 0.9,
              transition: reduceMotion.current ? undefined : 'top 120ms ease-out'
            }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-6 md:space-y-8">
          {steps.map((s, i) => {
            const shown = visibleSteps[i]
            return (
              <div key={s.title} data-timeline-step data-index={i} className="relative">
                {/* Dot connector */}
                <div
                  className="absolute -left-8 md:-left-10 top-3 w-4 h-4 rounded-full"
                  style={{
                    background: shown ? 'radial-gradient(circle, #F472B6, #A78BFA 60%)' : 'rgba(167,139,250,0.25)',
                    boxShadow: shown ? '0 0 14px rgba(167,139,250,0.6)' : 'none',
                    border: `1px solid ${colors.border}`
                  }}
                />
                <Card
                  className="transition-transform"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: radii.base,
                    transform: shown || reduceMotion.current ? 'none' : 'translateY(8px)',
                    opacity: shown || reduceMotion.current ? 1 : 0,
                    transition: reduceMotion.current ? undefined : 'opacity 420ms ease, transform 420ms ease'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-[12px]" style={{ background: 'rgba(167,139,250,0.16)' }} />
                    <div>
                      <h3 className="font-semibold" style={{ color: colors.text }}>{s.title}</h3>
                      <p className="text-sm mt-0.5" style={{ color: colors.muted }}>{s.desc}</p>
                    </div>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
