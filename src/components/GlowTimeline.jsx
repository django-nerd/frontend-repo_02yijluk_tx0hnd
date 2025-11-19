import { useEffect, useMemo, useRef, useState, Fragment } from 'react'
import { Card } from './UI'
import { colors, radii } from './Theme'

/*
  GlowTimeline (Scroll-Activated Timeline Connector)
  - Central vertical pipe (6px) inside the steps area (not over the heading)
  - Fill height follows scroll; spark at the tip
  - Alternating cards left/right on md+; stacked on mobile
  - Connector animates from pipe to card when revealed
  - Respects prefers-reduced-motion
  - Accepts props: title, subtitle, steps
*/
export default function GlowTimeline({
  title = 'Why people pick Nimbus',
  subtitle = 'A central pipe fills as you scroll; cards appear when the fill reaches them.',
  steps: stepsProp
}){
  const sectionRef = useRef(null)
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
      const el = sectionRef.current
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
    <section
      ref={sectionRef}
      aria-label="Timeline keunggulan"
      className="relative mt-24 md:mt-32 mb-24 md:mb-32 max-w-6xl mx-auto px-4 overflow-hidden"
    >
      {/* Heading */}
      <div className="mb-8 md:mb-10 text-center relative z-[2]">
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: colors.text }}>{title}</h2>
        {subtitle ? (
          <p className="text-sm md:text-base mt-2" style={{ color: colors.muted }}>{subtitle}</p>
        ) : null}
      </div>

      {/* Steps area wrapper (relative) so the pipe is confined below the heading */}
      <div className="relative">
        {/* Centered pipe (track + fill + spark) confined to steps area */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[0]">
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

        {/* Steps container: three columns on md+, single column on mobile */}
        <div className="relative z-[1] grid grid-cols-1 md:grid-cols-[1fr_72px_1fr] gap-y-4 md:gap-y-6 gap-x-4 md:gap-x-8">
          {steps.map((s, i) => {
            const isLeft = i % 2 === 0
            const shown = visibleSteps[i]
            return (
              <Fragment key={s.title}>
                {/* Left placeholder or left card */}
                <div
                  className={`${isLeft ? '' : 'hidden md:block'} md:col-start-1`}
                >
                  {isLeft ? (
                    <div data-step data-index={i}>
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
                  ) : null}
                </div>

                {/* Center connector (only md+) */}
                <div className="hidden md:flex md:col-start-2 relative items-center justify-center">
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

                {/* Right placeholder or right card (mobile shows card normally below due to single column) */}
                <div className={`${isLeft ? 'hidden md:block' : ''} md:col-start-3`}>
                  {!isLeft ? (
                    <div data-step data-index={i}>
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
                  ) : null}
                </div>

                {/* Mobile card (single column): render card once per step when hidden on md left/right */}
                <div className="md:hidden">
                  <div data-step data-index={i}>
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
              </Fragment>
            )
          })}
        </div>
      </div>
    </section>
  )
}
