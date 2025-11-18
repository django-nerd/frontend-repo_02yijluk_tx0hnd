import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Button, Card, Input, Select, Textarea } from '../components/UI'
import { colors } from '../components/Theme'

export default function Checkout(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [items] = useState([{sku:'VPS-1', title:'VPS Nano', qty:1, unit_price:3.99}])
  const [summary,setSummary] = useState({subtotal:0,discount:0,tax:0,total:0})
  const [billing,setBilling] = useState({name:'',email:'',address:'',method:'paypal'})
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')

  useEffect(()=>{(async()=>{
    try{
      const res = await fetch(`${baseUrl}/api/orders/preview`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items, discount:0, tax_rate:0.1})})
      const data = await res.json()
      setSummary(data)
    }catch(e){
      setSummary({subtotal:0,discount:0,tax:0,total:0})
    }
  })()},[])

  const pay = async()=>{
    setError('')
    setLoading(true)
    try{
      const res = await fetch(`${baseUrl}/api/checkout`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items, user_email: billing.email, payment_method: billing.method, discount:0, tax_rate:0.1})})
      if(!res.ok){
        const msg = await res.text();
        throw new Error(msg || 'Checkout failed')
      }
      const data = await res.json()
      window.location.href = `/payment?oid=${data.order_id}&method=${billing.method}&total=${summary.total}`
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-4" aria-label="Checkout page">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight" style={{color: colors.text}}>Checkout</h1>
          <p className="text-sm" style={{color: colors.muted}}>Enter your billing details and choose a payment method.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-base font-semibold" style={{color: colors.text}}>Billing details</h2>
            <Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="name" style={{color: colors.text}}>Full name</label>
                  <Input id="name" placeholder="Jane Doe" value={billing.name} onChange={e=>setBilling({...billing,name:e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="email" style={{color: colors.text}}>Email</label>
                  <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" value={billing.email} onChange={e=>setBilling({...billing,email:e.target.value})} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium" htmlFor="address" style={{color: colors.text}}>Address</label>
                  <Textarea id="address" placeholder="Street, City, Country" value={billing.address} onChange={e=>setBilling({...billing,address:e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="method" style={{color: colors.text}}>Payment method</label>
                  <Select id="method" value={billing.method} onChange={e=>setBilling({...billing,method:e.target.value})}>
                    <option value="paypal">PayPal</option>
                    <option value="robux">Robux</option>
                    <option value="manual">Manual</option>
                  </Select>
                </div>
              </div>
            </Card>
          </div>
          <div className="space-y-3">
            <h2 className="text-base font-semibold" style={{color: colors.text}}>Order Summary</h2>
            <Card>
              <div className="space-y-1 text-sm">
                <Row label="Subtotal" value={`$${summary.subtotal?.toFixed?.(2) || summary.subtotal}`}/>
                <Row label="Tax" value={`$${summary.tax?.toFixed?.(2) || summary.tax}`}/>
                <Row label="Total" value={`$${summary.total?.toFixed?.(2) || summary.total}`} bold/>
              </div>
              {error && <p className="text-sm" role="alert" style={{color: 'rgb(220,38,38)'}}>{error}</p>}
              <Button className="w-full mt-3" onClick={pay} disabled={loading} aria-busy={loading} aria-disabled={loading}>{loading? 'Processing…':'Pay Now'}</Button>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function Row({label,value,bold}){
  return (
    <div className="flex items-center justify-between">
      <span className={bold? 'font-semibold':''} style={{color: bold? colors.text : colors.muted}}>{label}</span>
      <span className={bold? 'font-semibold':''} style={{color: colors.text}}>{value}</span>
    </div>
  )
}
