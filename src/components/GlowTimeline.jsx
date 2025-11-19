import { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from './UI'
import { colors, radii } from './Theme'

/*
  GlowTimeline (Scroll-Activated Timeline Connector)
  - Central vertical pipe (6px) pinned to the visual center of the section
  - Pipe fill height follows scroll; spark dot at the tip
  - Alternating cards left/right; initially hidden, fade-in upward
  - Connector line animates from pipe center to each card when revealed
  - Respects prefers-reduced-motion
  - Now supports props to customize title, subtitle, and steps.
*/
export default function GlowTimeline({
  title = 'Why people pick Nimbus',
  subtitle = 'A central pipe fills as you scroll; cards appear when the fill reaches them.',
  steps: stepsProp
}){
  const containerRef = useRef(null)
  const reduceMotion = useRef(false)
  const [visibleSteps, setVisibleSteps] = useState([])

  const defaultSteps = useMemo(()=>[
    { title: 'Blazing VPS', desc: 'SSD NVMe, global regions, instant provision' },
    { title: 'Domains', desc: 'Simple search, WHOIS privacy, easy DNS' },
    { title: 'Panels', desc: 'Game & web panels with refined UX' },
    { title: 'Auto Payment', desc: 'Seamless capture, retries, fraud guard' },
  ], [])

  const steps = stepsProp && stepsProp.length ? stepsProp : defaultSteps

  useEffect(()=>{
    reduceMotion.current = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setVisibleSteps(new Array(steps.length).fill(false))
  }, [steps.length])

  useEffect(()=>{
    const onScroll = () => {
      const el = containerRef.current
      if(!el) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height + vh
      const y = vh - rect.top
      const progress = Math.min(1, Math.max(0, y / total))
      el.style.setProperty('--progress', String(progress))

      // Reveal cards when pipe fill crosses their centers
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
    <section ref={containerRef} aria-label="Timeline keunggulan" className="relative mt-16 md:mt-20">
      {/* Absolute centered pipe (track + fill + spark) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[6px]">
          {/* Track */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(180deg, rgba(148,163,184,0.28), rgba(148,163,184,0.10))',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)'
            }}
          />
          {/* Fill */}
          <div
            className="absolute top-0 left-0 right-0 rounded-full"
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
      </div>

      <div className="mb-6 text-center relative z-[1]">
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: colors.text }}>{title}</h2>
        {subtitle ? (
          <p className="text-sm md:text-base mt-1" style={{ color: colors.muted }}>{subtitle}</p>
        ) : null}
      </div>

      {/* Steps container: grid with free middle column for pipe/connector */}
      <div className="relative z-[1] grid grid-cols-1 md:grid-cols-[1fr_56px_1fr] gap-x-4 md:gap-x-6">
        {steps.map((s, i) => {
          const isLeft = i % 2 === 0
          const shown = visibleSteps[i]
          return (
            <div key={s.title} className="relative md:grid md:grid-cols-[1fr_56px_1fr] md:items-center py-2">
              {/* Left spacer for alignment on md */}
              <div className={`hidden md:block ${isLeft ? 'order-1' : 'order-3'}`} />

              {/* Center column: connector, anchored to pipe center */}
              <div className="hidden md:flex relative items-center justify-center order-2">
                <div
                  className={`absolute h-[2px] ${isLeft ? 'left-0 right-1/2' : 'left-1/2 right-0'}`}
                  style={{
                    background: shown ? 'linear-gradient(90deg, rgba(34,211,238,0.9), rgba(167,139,250,0.9))' : 'rgba(148,163,184,0.35)',
                    transform: shown || reduceMotion.current ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: isLeft ? 'right center' : 'left center',
                    transition: reduceMotion.current ? undefined : 'transform 420ms ease'
                  }}
                />
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{
                    borderColor: colors.border,
                    background: shown ? 'radial-gradient(circle, #22d3ee, #a78bfa 60%)' : 'rgba(148,163,184,0.25)',
                    boxShadow: shown ? '0 0 12px rgba(167,139,250,0.6)' : 'none'
                  }}
                />
              </div>

              {/* Card cell */}
              <div
                data-step
                data-index={i}
                className={`${isLeft ? 'order-3 md:order-1 md:pr-6' : 'order-3 md:order-3 md:pl-6'}`}
              >
                <Card
                  className="w-full transition-transform"
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
                    <div className="w-full">
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
    </section>
  )
}
