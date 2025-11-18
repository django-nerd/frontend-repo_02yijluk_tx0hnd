import { Link, NavLink } from 'react-router-dom'
import { Menu, Search, Bell, User, Shield } from 'lucide-react'

export default function Layout({children}){
  return (
    <div className="min-h-screen bg-[#F7F2FA] text-slate-800">
      <header className="sticky top-0 z-30 bg-[#F7F2FA]/80 backdrop-blur border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg tracking-tight">CreamyCloud</Link>
          <nav className="hidden md:flex items-center gap-4">
            <NavLink to="/" className={({isActive})=>`px-3 py-1.5 rounded-[12px] hover:bg-white ${isActive?'bg-white shadow-sm':''}`}>Home</NavLink>
            <NavLink to="/dashboard" className={({isActive})=>`px-3 py-1.5 rounded-[12px] hover:bg-white ${isActive?'bg-white shadow-sm':''}`}>Dashboard</NavLink>
            <NavLink to="/order" className={({isActive})=>`px-3 py-1.5 rounded-[12px] hover:bg-white ${isActive?'bg-white shadow-sm':''}`}>Order</NavLink>
            <NavLink to="/tos" className={({isActive})=>`px-3 py-1.5 rounded-[12px] hover:bg-white ${isActive?'bg-white shadow-sm':''}`}>TOS</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-3 py-1.5 rounded-[12px] bg-[#F24AA7] text-white hover:shadow">Login</Link>
            <Link to="/register" className="px-3 py-1.5 rounded-[12px] bg-[#A9D5F9] hover:shadow">Register</Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
