import { Link, NavLink } from 'react-router-dom'
import { colors, radii } from './Theme'
import { useEffect, useState } from 'react'

export default function Layout({children}){
  const [isDark, setIsDark] = useState(false)

  useEffect(()=>{
    // initialize from localStorage or system preference
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldDark = stored ? stored === 'dark' : prefersDark
    setIsDark(shouldDark)
    document.documentElement.classList.toggle('dark', shouldDark)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <div
      className="min-h-screen"
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
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold text-base tracking-tight flex items-center gap-2" style={{ color: colors.text }}>
            <span
              className="inline-block w-7 h-7 rounded-full"
              style={{ backgroundColor: colors.bubblegum, boxShadow:'0 4px 10px rgba(244,114,182,0.25)' }}
            />
            Nimbus
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'Home', wash: 'rgba(244,114,182,0.12)' },
              { to: '/dashboard', label: 'Dashboard', wash: 'rgba(167,139,250,0.12)' },
              { to: '/order', label: 'Order', wash: 'rgba(251,191,36,0.12)' },
              { to: '/tos', label: 'TOS', wash: 'rgba(96,165,250,0.12)' },
            ].map(({to, label, wash}) => (
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
          <div className="flex items-center gap-2">
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
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
