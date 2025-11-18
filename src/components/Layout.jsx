import { Link, NavLink } from 'react-router-dom'
import { colors, radii } from './Theme'

export default function Layout({children}){
  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(1200px 600px at 80% -10%, rgba(167,139,250,0.15), transparent), radial-gradient(800px 400px at -10% 10%, rgba(244,114,182,0.12), transparent)`, backgroundColor: colors.bg }}>
      <header className="sticky top-0 z-30 backdrop-blur border-b" style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderColor: colors.border }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold text-base tracking-tight flex items-center gap-2">
            <span className="inline-block w-7 h-7 rounded-full" style={{ backgroundColor: colors.bubblegum, boxShadow:'0 4px 10px rgba(244,114,182,0.25)' }} />
            Nimbus
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={({isActive})=>`px-3 py-2 rounded-[${radii.pill}] hover:bg-pink-50 ${isActive?'bg-pink-50':''}`}>Home</NavLink>
            <NavLink to="/dashboard" className={({isActive})=>`px-3 py-2 rounded-[${radii.pill}] hover:bg-violet-50 ${isActive?'bg-violet-50':''}`}>Dashboard</NavLink>
            <NavLink to="/order" className={({isActive})=>`px-3 py-2 rounded-[${radii.pill}] hover:bg-amber-50 ${isActive?'bg-amber-50':''}`}>Order</NavLink>
            <NavLink to="/tos" className={({isActive})=>`px-3 py-2 rounded-[${radii.pill}] hover:bg-sky-50 ${isActive?'bg-sky-50':''}`}>TOS</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-3 py-2 text-sm text-white" style={{ backgroundColor: colors.bubblegum, borderRadius: radii.pill }}>Login</Link>
            <Link to="/register" className="px-3 py-2 text-sm border" style={{ borderColor: colors.border, borderRadius: radii.pill }}>Register</Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
