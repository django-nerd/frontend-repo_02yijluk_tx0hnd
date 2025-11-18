import { useEffect, useRef, useState } from 'react'
import { Button, Card } from '../components/UI'
import Layout from '../components/Layout'
import { colors } from '../components/Theme'

const features = [
  {title:'Blazing VPS',desc:'SSD NVMe, global regions, instant provision',tone:'violet', bg:'#F5F3FF'},
  {title:'Domains',desc:'Simple search, WHOIS privacy, easy DNS',tone:'pink', bg:'#FFF1F2'},
  {title:'Panels',desc:'Game & web panels with refined UX',tone:'sky', bg:'#F0F9FF'},
  {title:'Auto Payment',desc:'Seamless capture, retries, fraud guard',tone:'lemon', bg:'#FFFBEB'},
]

export default function Home(){
  const featuresRef = useRef(null)
  const heroRef = useRef(null)
  const reduceMotion = useRef(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(()=>{
    // respect reduced motion
    reduceMotion.current = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onScroll = () => {
      const y = window.scrollY
      setScrollY(y)
      if(heroRef.current){
        const h = heroRef.current.offsetHeight || window.innerHeight
        const p = Math.min(1, Math.max(0, y / h))
        heroRef.current.style.setProperty('--p', String(p))
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return ()=> window.removeEventListener('scroll', onScroll)
  }, [])

  const handleScrollDown = () => {
    const target = featuresRef.current
    if(!target) return
    const top = target.getBoundingClientRect().top + window.scrollY - 16
    window.scrollTo({ top, behavior: 'smooth' })
  }

  // Motion helpers (no heavy 3D, just cheap transforms)
  const shift = reduceMotion.current ? 0 : Math.min(40, scrollY * 0.06)
  const blobShiftA = reduceMotion.current ? 0 : Math.min(60, scrollY * 0.03)
  const blobShiftB = reduceMotion.current ? 0 : Math.min(60, scrollY * 0.02)

  return (
    <Layout>
      {/* Full-bleed, full-screen Nimbus Hero (no 3D) */}
      <section
        ref={heroRef}
        className="relative overflow-hidden min-h-screen flex items-stretch w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
        aria-label="Nimbus hero"
        style={{ position: 'relative' }}
      >
        {/* Lightweight background: layered gradients + blurred blobs */}
        <div className="absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(1200px 500px at 80% -10%, rgba(167,139,250,0.18), transparent),\n                 radial-gradient(900px 400px at -10% 10%, rgba(244,114,182,0.16), transparent),\n                 linear-gradient(to top, rgba(252,250,255,0.95), rgba(252,250,255,0.55))',
            }}
          />
          {/* Pink blob */}
          <div
            className="absolute -top-16 -left-10 w-[420px] h-[420px] rounded-full blur-3xl opacity-60"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(244,114,182,0.55), rgba(244,114,182,0.0) 60%)',
              transform: `translateY(${blobShiftA}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          />
          {/* Sky blob */}
          <div
            className="absolute top-10 right-0 w-[520px] h-[520px] rounded-full blur-3xl opacity-60"
            style={{
              background: 'radial-gradient(circle at 70% 50%, rgba(96,165,250,0.45), rgba(96,165,250,0.0) 60%)',
              transform: `translateY(-${blobShiftB}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          />
        </div>

        {/* Copy block with subtle parallax on scroll */}
        <div className="relative z-10 w-full flex flex-col items-center justify-end md:justify-center text-center px-4 pb-28 md:pb-10">
          <div
            style={{
              transform: `translateY(${shift}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium shadow"
              style={{ backgroundColor: '#FFF1F2', color: '#9D174D', boxShadow:'0 6px 24px rgba(244,114,182,0.25)' }}
            >
              New • Pastel Play theme
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold mt-3">Nimbus</h1>
            <p className="text-slate-600 max-w-2xl mx-auto mt-2">
              A playful, energetic platform for domains, VPS, and panels — with candy gradients and soft, cute surfaces.
            </p>
            <div className="mt-5 flex gap-3 justify-center">
              <Button variant="candy" aria-label="Get started with Nimbus">Get Started</Button>
              <Button variant="outline" aria-label="Open the dashboard">Visit Dashboard</Button>
            </div>
          </div>

          {/* Scroll cue */}
          <button
            type="button"
            onClick={handleScrollDown}
            className="group mt-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border backdrop-blur"
            aria-label="Scroll to features"
            style={{ borderColor: '#F1E8FF', backgroundColor: 'rgba(255,255,255,0.65)' }}
          >
            <span className="w-2 h-2 rounded-full bg-pink-400 group-hover:bg-violet-400 transition-colors" />
            Scroll
            <span
              aria-hidden
              className="ml-1 inline-block w-3 h-3 rounded-full border border-violet-300"
              style={{ boxShadow: 'inset 0 -6px 0 0 rgba(167,139,250,0.55)', transform: 'rotate(45deg)' }}
            />
          </button>
        </div>

        {/* Subtle blur at the bottom to hint scroll */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24"
          style={{
            backdropFilter: 'blur(calc(6px * var(--p, 0)))',
            background: 'linear-gradient(to bottom, rgba(252,250,255,0), rgba(252,250,255,0.9))',
          }}
        />
      </section>

      {/* Content below hero */}
      <section ref={featuresRef} id="features" className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f)=> (
          <Card key={f.title} className="transition-transform hover:-translate-y-0.5" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="h-12 w-12 rounded-[14px]" style={{ background: f.bg, boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.03)' }}/>
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="text-sm text-slate-600">{f.desc}</p>
          </Card>
        ))}
      </section>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i=>(
          <Card key={i} style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFAFF 100%)' }}>
            <h4 className="font-semibold mb-1">Loved by teams</h4>
            <p className="text-sm text-slate-600">“The cute, soft UI makes serious work feel light. Provisioning feels magical.”</p>
          </Card>
        ))}
      </section>

      <section className="mt-12">
        <div className="rounded-[14px] p-6 border" style={{ backgroundColor: '#F5F3FF', color:'#0F172A', borderColor: colors.border }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">Make it yours</h3>
              <p className="text-sm/relaxed opacity-80">Switch themes, tune colors, and keep the soft, cheerful vibe across your workspace.</p>
            </div>
            <Button variant="secondary" style={{ backgroundColor: '#FFFFFF', borderColor: colors.border, borderRadius: '999px' }}>Customize</Button>
          </div>
        </div>
      </section>
    </Layout>
  )
}
