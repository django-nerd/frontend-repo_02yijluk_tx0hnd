import { Link, NavLink } from 'react-router-dom'
import { colors, radii } from './Theme'
import { useEffect, useState } from 'react'

export default function Layout({children}){
  const [isDark, setIsDark] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(()=>{
    // initialize from localStorage or system preference
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldDark = stored ? stored === 'dark' : prefersDark
    setIsDark(shouldDark)
    document.documentElement.classList.toggle('dark', shouldDark)
  }, [])

  // Prevent background scroll when mobile menu is open
  useEffect(()=>{
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [open])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const links = [
    { to: '/', label: 'Home', wash: 'rgba(244,114,182,0.12)' },
    { to: '/dashboard', label: 'Dashboard', wash: 'rgba(167,139,250,0.12)' },
    { to: '/order', label: 'Order', wash: 'rgba(251,191,36,0.12)' },
    { to: '/tos', label: 'TOS', wash: 'rgba(96,165,250,0.12)' },
  ]

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background:
          'radial-gradient(1200px 600px at 80% -10%, rgba(167,139,250,0.12), transparent), radial-gradient(800px 400px at -10% 10%, rgba(244,114,182,0.10), transparent)',
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      <header
        className="sticky top-0 z-30 backdrop-blur border-b"
        style={{ backgroundColor: 'var(--header-glass)', borderColor: colors.border }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="font-semibold text-base tracking-tight flex items-center gap-2" style={{ color: colors.text }}>
            <span
              className="inline-block w-7 h-7 rounded-full"
              style={{ backgroundColor: colors.bubblegum, boxShadow:'0 4px 10px rgba(244,114,182,0.25)' }}
            />
            Nimbus
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({to, label, wash}) => (
              <NavLink
                key={to}
                to={to}
                className={({isActive})=>`px-3 py-2 rounded-[${radii.pill}] transition-colors`}
                style={({isActive})=>({
                  color: colors.text,
                  backgroundColor: isActive ? wash : 'transparent'
                })}
              >{label}</NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark? 'Switch to light mode' : 'Switch to dark mode'}
              className="px-3 py-2 text-sm border transition-colors"
              style={{ borderColor: colors.border, borderRadius: radii.pill, color: colors.text, backgroundColor: colors.surface }}
            >
              {isDark ? 'Light' : 'Dark'}
            </button>
            <Link to="/login" className="px-3 py-2 text-sm text-white elev-1 hover:elev-2" style={{ backgroundColor: colors.bubblegum, borderRadius: radii.pill }}>Login</Link>
            <Link to="/register" className="px-3 py-2 text-sm border hover-wash-primary" style={{ borderColor: colors.border, borderRadius: radii.pill, color: colors.text }}>Register</Link>
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 text-sm border transition-colors"
              style={{ borderColor: colors.border, borderRadius: radii.pill, color: colors.text, backgroundColor: colors.surface }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={()=>setOpen(true)}
              className="p-2 border elev-1"
              style={{ borderColor: colors.border, borderRadius: radii.pill, color: colors.text, backgroundColor: colors.surface }}
            >
              {/* Hamburger icon */}
              <span className="block w-5 h-[2px] mb-1" style={{ backgroundColor: colors.text }} />
              <span className="block w-5 h-[2px] mb-1" style={{ backgroundColor: colors.text }} />
              <span className="block w-5 h-[2px]" style={{ backgroundColor: colors.text }} />
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        <div
          className={`md:hidden fixed inset-0 z-40 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
          aria-hidden={!open}
        >
          {/* Backdrop */}
          <div
            onClick={()=>setOpen(false)}
            className={`absolute inset-0 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
            style={{ background: 'rgba(2,6,23,0.5)' }}
          />

          {/* Sheet */}
          <div
            className={`absolute right-0 top-0 h-full w-[84%] max-w-sm transition-transform duration-200 ${open ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ backgroundColor: colors.surface, borderLeft: `1px solid ${colors.border}`, boxShadow: 'var(--shadow-3)' }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: colors.border }}>
              <div className="flex items-center gap-2">
                <span className="inline-block w-6 h-6 rounded-full" style={{ backgroundColor: colors.bubblegum }} />
                <span className="font-medium" style={{ color: colors.text }}>Nimbus</span>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={()=>setOpen(false)}
                className="p-2 border"
                style={{ borderColor: colors.border, borderRadius: radii.pill, backgroundColor: colors.surface, color: colors.text }}
              >
                ✕
              </button>
            </div>

            <nav className="px-2 py-2">
              {links.map(({to, label, wash}) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={()=>setOpen(false)}
                  className={({isActive})=>`block px-3 py-3 rounded-[${radii.base}] text-base mb-1`}
                  style={({isActive})=>({
                    color: colors.text,
                    backgroundColor: isActive ? wash : 'transparent'
                  })}
                >{label}</NavLink>
              ))}
            </nav>

            <div className="px-3 py-3 border-t space-y-2" style={{ borderColor: colors.border }}>
              <Link onClick={()=>setOpen(false)} to="/login" className="block text-center px-3 py-2 text-sm text-white elev-1 hover:elev-2" style={{ backgroundColor: colors.bubblegum, borderRadius: radii.pill }}>Login</Link>
              <Link onClick={()=>setOpen(false)} to="/register" className="block text-center px-3 py-2 text-sm border hover-wash-primary" style={{ borderColor: colors.border, borderRadius: radii.pill, color: colors.text }}>Register</Link>
            </div>

            <div className="px-3 pb-8 pt-2 text-xs" style={{ color: 'var(--muted)' }}>
              <p>v1.0 • Optimized for multi-platform. If something looks off on your device, let us know.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
