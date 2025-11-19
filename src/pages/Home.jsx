import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/UI'
import Layout from '../components/Layout'
import { colors } from '../components/Theme'
import ProductScroller from '../components/ProductScroller'
import Footer from '../components/Footer'
import GlowTimeline from '../components/GlowTimeline'

export default function Home(){
  const featuresRef = useRef(null)
  const heroRef = useRef(null)
  const reduceMotion = useRef(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(()=>{
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

  const shift = reduceMotion.current ? 0 : Math.min(40, scrollY * 0.06)
  const blobShiftA = reduceMotion.current ? 0 : Math.min(60, scrollY * 0.03)
  const blobShiftB = reduceMotion.current ? 0 : Math.min(60, scrollY * 0.02)

  const timelineSteps = [
    { title: 'Performa Kencang', desc: 'CPU modern + SSD NVMe untuk workload berat dan latensi rendah.' },
    { title: 'Jaringan Global', desc: 'Lokasi server beragam agar lebih dekat dengan pengguna Anda.' },
    { title: 'Panel Super Mudah', desc: 'Kelola VPS, domain, dan panel dengan UI yang ramah dan cepat.' },
    { title: 'Keamanan & Reliabilitas', desc: 'Isolasi yang kuat, backup opsional, dan SLA uptime 99.9%.' },
    { title: 'Pembayaran Otomatis', desc: 'Dukungan payment lokal & global dengan penagihan otomatis.' },
    { title: 'Dukungan 24/7', desc: 'Tim support responsif siap membantu kapan pun dibutuhkan.' },
  ]

  return (
    <Layout>
      <section
        ref={heroRef}
        className="relative overflow-hidden min-h-screen -mt-8 md:-mt-10 flex items-stretch w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
        aria-label="Nimbus hero"
        style={{ position: 'relative' }}
      >
        <div className="absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              background:
                `radial-gradient(1200px 500px at 80% -10%, rgba(167,139,250,0.18), transparent),\n                 radial-gradient(900px 400px at -10% 10%, rgba(244,114,182,0.16), transparent),\n                 linear-gradient(to top, color-mix(in oklab, var(--bg) 95%, transparent), color-mix(in oklab, var(--bg) 55%, transparent))`,
            }}
          />
          <div
            className="absolute -top-16 -left-10 w-[420px] h-[420px] rounded-full blur-3xl opacity-60"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(244,114,182,0.55), rgba(244,114,182,0.0) 60%)',
              transform: `translateY(${blobShiftA}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          />
          <div
            className="absolute top-10 right-0 w-[520px] h-[520px] rounded-full blur-3xl opacity-60"
            style={{
              background: 'radial-gradient(circle at 70% 50%, rgba(96,165,250,0.45), rgba(96,165,250,0.0) 60%)',
              transform: `translateY(-${blobShiftB}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center justify-end md:justify-center text-center px-4 pb-28 md:pb-10">
          <div
            style={{
              transform: `translateY(${shift}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium shadow"
              style={{ backgroundColor: 'rgba(244,114,182,0.15)', color: colors.text, boxShadow:'0 6px 24px rgba(244,114,182,0.25)' }}
            >
              New • Pastel Play theme
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold mt-3" style={{ color: colors.text }}>Nimbus</h1>
            <p className="max-w-2xl mx-auto mt-2" style={{ color: colors.muted }}>
              A playful, energetic platform for domains, VPS, and panels — with candy gradients and soft, cute surfaces.
            </p>
            <div className="mt-5 flex gap-3 justify-center">
              <Button variant="candy" aria-label="Get started with Nimbus">Get Started</Button>
              <Button variant="outline" aria-label="Open the dashboard">Visit Dashboard</Button>
            </div>
          </div>

        <button
            type="button"
            onClick={handleScrollDown}
            className="group mt-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border backdrop-blur"
            aria-label="Scroll to products"
            style={{ borderColor: colors.border, backgroundColor: 'color-mix(in oklab, var(--surface) 70%, transparent)', color: colors.text }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--bubblegum)' }} />
            Lihat produk
            <span
              aria-hidden
              className="ml-1 inline-block w-3 h-3 rounded-full border"
              style={{ borderColor: 'rgba(167,139,250,0.4)', boxShadow: 'inset 0 -6px 0 0 rgba(167,139,250,0.55)', transform: 'rotate(45deg)' }}
            />
          </button>
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24"
          style={{
            backdropFilter: 'blur(calc(6px * var(--p, 0)))',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0), color-mix(in oklab, var(--bg) 90%, transparent))',
          }}
        />
      </section>

      {/* Timeline keunggulan (Scroll-Activated Timeline Connector) */}
      <GlowTimeline
        title="Keunggulan Nimbus"
        subtitle="Pipa tengah akan terisi seiring scroll; setiap poin muncul dengan konektor animasi."
        steps={timelineSteps}
      />

      {/* Anchor untuk ke bagian produk (Choose your VPS) */}
      <div ref={featuresRef} />

      {/* Horizontal product scroller dengan wheel-to-horizontal behavior */}
      <ProductScroller />

      <Footer />
    </Layout>
  )
}
