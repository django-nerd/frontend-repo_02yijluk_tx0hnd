import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Button, Card, Input, Select, Textarea } from '../components/UI'

export default function Checkout(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [items] = useState([{sku:'VPS-1', title:'VPS Nano', qty:1, unit_price:3.99}])
  const [summary,setSummary] = useState({subtotal:0,discount:0,tax:0,total:0})
  const [billing,setBilling] = useState({name:'',email:'',address:'',method:'paypal'})

  useEffect(()=>{(async()=>{
    const res = await fetch(`${baseUrl}/api/orders/preview`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items, discount:0, tax_rate:0.1})})
    const data = await res.json()
    setSummary(data)
  })()},[])

  const pay = async()=>{
    const res = await fetch(`${baseUrl}/api/checkout`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items, user_email: billing.email, payment_method: billing.method, discount:0, tax_rate:0.1})})
    const data = await res.json()
    window.location.href = `/payment?oid=${data.order_id}&method=${billing.method}&total=${summary.total}`
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          <h2 className="text-xl font-semibold">Billing details</h2>
          <Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Full name" value={billing.name} onChange={e=>setBilling({...billing,name:e.target.value})} />
              <Input placeholder="Email" value={billing.email} onChange={e=>setBilling({...billing,email:e.target.value})} />
              <Textarea className="sm:col-span-2" placeholder="Address" value={billing.address} onChange={e=>setBilling({...billing,address:e.target.value})} />
              <Select value={billing.method} onChange={e=>setBilling({...billing,method:e.target.value})}>
                <option value="paypal">PayPal</option>
                <option value="robux">Robux</option>
                <option value="manual">Manual</option>
              </Select>
            </div>
          </Card>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <Card>
            <div className="space-y-1 text-sm">
              <Row label="Subtotal" value={`$${summary.subtotal?.toFixed?.(2) || summary.subtotal}`}/>
              <Row label="Tax" value={`$${summary.tax?.toFixed?.(2) || summary.tax}`}/>
              <Row label="Total" value={`$${summary.total?.toFixed?.(2) || summary.total}`} bold/>
            </div>
            <Button className="w-full mt-3" onClick={pay}>Pay Now</Button>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

function Row({label,value,bold}){
  return (
    <div className="flex items-center justify-between">
      <span className={bold? 'font-semibold':'text-slate-600'}>{label}</span>
      <span className={bold? 'font-semibold':''}>{value}</span>
    </div>
  )
}
