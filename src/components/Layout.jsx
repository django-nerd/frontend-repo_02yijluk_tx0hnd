import { Link, NavLink } from 'react-router-dom'

export default function Layout({children}){
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold text-base tracking-tight">Nimbus</Link>
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={({isActive})=>`px-3 py-2 rounded-[6px] hover:bg-slate-50 ${isActive?'bg-slate-50':''}`}>Home</NavLink>
            <NavLink to="/dashboard" className={({isActive})=>`px-3 py-2 rounded-[6px] hover:bg-slate-50 ${isActive?'bg-slate-50':''}`}>Dashboard</NavLink>
            <NavLink to="/order" className={({isActive})=>`px-3 py-2 rounded-[6px] hover:bg-slate-50 ${isActive?'bg-slate-50':''}`}>Order</NavLink>
            <NavLink to="/tos" className={({isActive})=>`px-3 py-2 rounded-[6px] hover:bg-slate-50 ${isActive?'bg-slate-50':''}`}>TOS</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-3 py-2 rounded-[6px] bg-sky-500 text-white hover:bg-sky-600">Login</Link>
            <Link to="/register" className="px-3 py-2 rounded-[6px] border border-gray-200 hover:bg-slate-50">Register</Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
