import { useState } from 'react'
import Layout from '../components/Layout'
import { Button, Input, Card } from '../components/UI'
import { colors } from '../components/Theme'

function AuthShell({title, subtitle, children}){
  return (
    <Layout>
      <div className="min-h-[70vh] grid grid-cols-1 place-items-center">
        <Card className="w-full max-w-sm p-6">
          <h1 className="text-xl font-semibold mb-1" style={{ color: colors.text }}>{title}</h1>
          <p className="text-sm mb-6" style={{ color: colors.muted }}>{subtitle}</p>
          {children}
        </Card>
      </div>
    </Layout>
  )
}

function PasswordField({id,label,value,onChange,autoComplete}){
  const [show,setShow] = useState(false)
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" htmlFor={id} style={{ color: colors.text }}>{label}</label>
      <div className="relative">
        <Input id={id} type={show? 'text':'password'} autoComplete={autoComplete} placeholder="********" value={value} onChange={onChange} aria-label={label} />
        <button
          type="button"
          onClick={()=>setShow(s=>!s)}
          aria-label={show? 'Hide password':'Show password'}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-[6px] focus:outline-none focus-visible:ring-2"
          style={{ color: colors.muted, backgroundColor: 'transparent' }}
        >
          {show? 'Hide':'Show'}
        </button>
      </div>
    </div>
  )
}

function SocialButtons(){
  return (
    <div className="space-y-2">
      <Button variant="outline" className="w-full" aria-label="Continue with Google">Continue with Google</Button>
      <Button variant="outline" className="w-full" aria-label="Continue with GitHub">Continue with GitHub</Button>
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
      window.location.href = '/dashboard'
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Sign in" subtitle="Access your account">
      <form onSubmit={onSubmit} className="space-y-4" aria-label="Sign in form">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="email" style={{ color: colors.text }}>Email</label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <PasswordField id="password" label="Password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" />
        {error && <p className="text-sm" style={{ color: '#EF4444' }} role="alert">{error}</p>}
        <Button type="submit" className="w-full" variant="candy" disabled={loading} aria-busy={loading} aria-disabled={loading}>{loading?'Signing in…':'Sign in'}</Button>
        <div className="relative flex items-center justify-center my-2">
          <span className="h-px w-full" style={{ backgroundColor: colors.border }} aria-hidden="true" />
          <span className="px-2 text-xs" style={{ color: colors.muted }}>or</span>
          <span className="h-px w-full" style={{ backgroundColor: colors.border }} aria-hidden="true" />
        </div>
        <SocialButtons />
        <p className="text-sm" style={{ color: colors.muted }}>No account? <a href="/register" style={{ color: 'var(--sky)' }} className="hover:underline">Create one</a></p>
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
      window.location.href = '/login'
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create account" subtitle="Start managing your services">
      <form onSubmit={onSubmit} className="space-y-4" aria-label="Register form">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="name" style={{ color: colors.text }}>Full name</label>
          <Input id="name" placeholder="Jane Doe" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="email" style={{ color: colors.text }}>Email</label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <PasswordField id="password" label="Password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" />
        {error && <p className="text-sm" style={{ color: '#EF4444' }} role="alert">{error}</p>}
        <Button type="submit" className="w-full" variant="candy" disabled={loading} aria-busy={loading} aria-disabled={loading}>{loading?'Creating…':'Create account'}</Button>
        <div className="relative flex items-center justify-center my-2">
          <span className="h-px w-full" style={{ backgroundColor: colors.border }} aria-hidden="true" />
          <span className="px-2 text-xs" style={{ color: colors.muted }}>or</span>
          <span className="h-px w-full" style={{ backgroundColor: colors.border }} aria-hidden="true" />
          </div>
        <SocialButtons />
        <p className="text-sm" style={{ color: colors.muted }}>Already have an account? <a href="/login" style={{ color: 'var(--sky)' }} className="hover:underline">Sign in</a></p>
      </form>
    </AuthShell>
  )
}

export default function Illustration(){
  return null
}
