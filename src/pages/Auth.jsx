import { useState } from 'react'
import { Button, Input, Card } from '../components/UI'

function AuthShell({title, subtitle, children}){
  return (
    <div className="min-h-[70vh] grid grid-cols-1 place-items-center">
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-xl font-semibold mb-1">{title}</h1>
        <p className="text-sm text-slate-600 mb-6">{subtitle}</p>
        {children}
      </Card>
    </div>
  )
}

export function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const onSubmit = async (e)=>{
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      const res = await fetch(`${baseUrl}/api/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})
      if(!res.ok){
        const msg = await res.text();
        throw new Error(msg || 'Login failed')
      }
      const data = await res.json()
      alert(`Welcome ${data.role}!`)
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Sign in" subtitle="Access your account">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="password">Password</label>
          <Input id="password" type="password" autoComplete="current-password" placeholder="********" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading?'Signing in…':'Sign in'}</Button>
        <p className="text-sm text-slate-600">No account? <a href="/register" className="text-sky-600 hover:underline">Create one</a></p>
      </form>
    </AuthShell>
  )
}

export function Register(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [name,setName] = useState('')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const onSubmit = async (e)=>{
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      const res = await fetch(`${baseUrl}/api/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,name})})
      if(!res.ok){
        const msg = await res.text();
        throw new Error(msg || 'Registration failed')
      }
      alert('Account created! You can now sign in.')
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create account" subtitle="Start managing your services">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="name">Full name</label>
          <Input id="name" placeholder="Jane Doe" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="password">Password</label>
          <Input id="password" type="password" autoComplete="new-password" placeholder="********" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading?'Creating…':'Create account'}</Button>
        <p className="text-sm text-slate-600">Already have an account? <a href="/login" className="text-sky-600 hover:underline">Sign in</a></p>
      </form>
    </AuthShell>
  )
}

export default function Illustration(){
  return null
}
