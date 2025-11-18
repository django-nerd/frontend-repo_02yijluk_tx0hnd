import { useState } from 'react'
import { Button, Input, Card } from '../components/UI'

export function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const onSubmit = async (e)=>{
    e.preventDefault()
    const res = await fetch(`${baseUrl}/api/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})
    const data = await res.json()
    alert(`Welcome ${data.role}!`)
  }

  return (
    <SplitScreen>
      <Illustration/>
      <Card className="max-w-md w-full mx-auto">
        <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
        <p className="text-slate-600 mb-4">Login to access your dashboard</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input aria-label="Email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input aria-label="Password" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Button type="submit" className="w-full">Login</Button>
          <a href="/register" className="text-sm text-sky-600">Create an account</a>
        </form>
      </Card>
    </SplitScreen>
  )
}

export function Register(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [name,setName] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const onSubmit = async (e)=>{
    e.preventDefault()
    await fetch(`${baseUrl}/api/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})
    alert('Account created! You can now login.')
  }

  return (
    <SplitScreen>
      <Illustration/>
      <Card className="max-w-md w-full mx-auto">
        <h2 className="text-2xl font-bold mb-2">Create account</h2>
        <p className="text-slate-600 mb-4">Start your pastel journey</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input aria-label="Name" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <Input aria-label="Email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input aria-label="Password" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Button type="submit" className="w-full">Register</Button>
          <a href="/login" className="text-sm text-sky-600">Back to login</a>
        </form>
      </Card>
    </SplitScreen>
  )
}

function SplitScreen({children}){
  return (
    <div className="min-h-[70vh] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      {children}
    </div>
  )
}

function Illustration(){
  return (
    <div className="rounded-[12px] h-80 md:h-[70vh] w-full bg-gradient-to-br from-[#F9A8D4] to-[#A9F9CD] shadow-inner" aria-hidden>
      <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.4),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.4),transparent_40%)] rounded-[12px]"></div>
    </div>
  )
}
