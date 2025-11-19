import { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from './UI'
import { colors, radii } from './Theme'

/*
  GlowTimeline
  - Central vertical pipe that fills with scroll (progress bar)
  - Alternating cards on the left and right of the pipe
  - Each card stays invisible until the fill reaches its vertical position,
    then it fades in upward from below.
  - Connector line visually attaches the pipe to the center of each card.
*/
export default function GlowTimeline(){
  const containerRef = useRef(null)
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

    const onScroll = () => {
      const el = containerRef.current
      if(!el) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height + vh
      const y = vh - rect.top
      const progress = Math.min(1, Math.max(0, y / total))
      el.style.setProperty('--progress', String(progress))

      // reveal cards when the pipe reaches their vertical center
      const cards = el.querySelectorAll('[data-step]')
      cards.forEach((card) => {
        const idx = Number(card.getAttribute('data-index'))
        const cardRect = card.getBoundingClientRect()
        const containerTop = rect.top
        const cardCenterY = (cardRect.top + cardRect.bottom) / 2 - containerTop
        const pipeFillY = progress * rect.height
        if (pipeFillY >= cardCenterY - 8) {
          setVisibleSteps(prev => {
            if (prev[idx]) return prev
            const next = [...prev]
            next[idx] = true
            return next
          })
        }
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return ()=>{
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section ref={containerRef} aria-label="Highlights" className="mt-14">
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: colors.text }}>Why people pick Nimbus</h2>
        <p className="text-sm md:text-base mt-1" style={{ color: colors.muted }}>A central pipe fills as you scroll; cards appear when the fill reaches them.</p>
      </div>

      {/* Grid: left column, pipe, right column */}
      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_56px_1fr] gap-x-4 md:gap-x-6">
        {/* Pipe (track + fill + spark) */}
        <div className="hidden md:block relative" aria-hidden>
          {/* Track */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[6px] rounded-full"
            style={{
              background: 'linear-gradient(180deg, rgba(148,163,184,0.25), rgba(148,163,184,0.1))',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
            }}
          />
          {/* Fill */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[6px] rounded-full"
            style={{
              height: 'calc(var(--progress, 0) * 100%)',
              background: 'linear-gradient(180deg, #22d3ee 0%, #a78bfa 45%, #f472b6 100%)',
              boxShadow: '0 0 14px rgba(167,139,250,0.55), 0 0 26px rgba(244,114,182,0.35)',
              transition: reduceMotion.current ? undefined : 'height 120ms ease-out'
            }}
          />
          {/* Spark */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: 'calc((var(--progress, 0) * 100%) - 7px)',
              width: 16, height: 16, borderRadius: 9999,
              background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(34,211,238,0.5) 50%, rgba(167,139,250,0.0) 70%)',
              filter: 'blur(0.4px)', opacity: 0.95,
              transition: reduceMotion.current ? undefined : 'top 120ms ease-out'
            }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-8 md:space-y-10 md:col-span-3">
          {steps.map((s, i) => {
            const isLeft = i % 2 === 0
            const shown = visibleSteps[i]
            return (
              <div key={s.title} className="relative md:grid md:grid-cols-[1fr_56px_1fr] md:items-center">
                {/* Left filler cell for grid alignment */}
                <div className={`hidden md:block ${isLeft ? 'order-1' : 'order-3'}`} />

                {/* Center: connector + node */}
                <div className="hidden md:flex relative items-center justify-center order-2">
                  {/* Connector line from pipe to card center */}
                  <div
                    className={`absolute h-[2px] ${isLeft ? 'left-1/2 right-0' : 'right-1/2 left-0'}`}
                    style={{
                      background: shown ? 'linear-gradient(90deg, rgba(34,211,238,0.9), rgba(167,139,250,0.9))' : 'rgba(148,163,184,0.35)',
                      transformOrigin: isLeft ? 'left center' : 'right center',
                      transform: shown || reduceMotion.current ? 'scaleX(1)' : 'scaleX(0)',
                      transition: reduceMotion.current ? undefined : 'transform 420ms ease'
                    }}
                  />
                  {/* Node */}
                  <div
                    className="w-3 h-3 rounded-full border"
                    style={{
                      borderColor: colors.border,
                      background: shown ? 'radial-gradient(circle, #22d3ee, #a78bfa 60%)' : 'rgba(148,163,184,0.25)',
                      boxShadow: shown ? '0 0 12px rgba(167,139,250,0.6)' : 'none'
                    }}
                  />
                </div>

                {/* Card */}
                <div data-step data-index={i} className={`${isLeft ? 'order-3 md:order-1 md:pr-6' : 'order-3 md:order-3 md:pl-6'}`}>
                  <Card
                    className="transition-transform"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderRadius: radii.base,
                      transform: shown || reduceMotion.current ? 'none' : 'translateY(12px)',
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
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
