import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Button, Card, Input } from '../components/UI'

export default function Order(){
  const [products,setProducts] = useState([])
  const [cart,setCart] = useState({})
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(()=>{(async()=>{
    const res = await fetch(`${baseUrl}/api/products`)
    const data = await res.json()
    setProducts(data.items || [])
  })()},[])

  const add = (p)=>{
    setCart(prev=>{
      const ex = prev[p.sku] || {qty:0, unit_price:p.price, title:p.title, sku:p.sku}
      return {...prev, [p.sku]: {...ex, qty: ex.qty+1}}
    })
  }
  const updateQty = (sku,qty)=>{
    setCart(prev=>({...prev,[sku]:{...prev[sku],qty:Math.max(0,qty)}}))
  }

  const items = Object.values(cart).filter(i=>i.qty>0)

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          <h2 className="text-xl font-semibold">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map(p=> (
              <Card key={p.sku}>
                <h4 className="font-semibold">{p.title}</h4>
                <p className="text-sm text-slate-600">{p.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-semibold">${p.price}</span>
                  <Button onClick={()=>add(p)} size="sm">Add</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <Card>
            <div className="space-y-2">
              {items.length===0 && <p className="text-sm text-slate-600">Your cart is empty</p>}
              {items.map(i=> (
                <div key={i.sku} className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{i.title}</p>
                    <p className="text-xs text-slate-600">${i.unit_price}</p>
                  </div>
                  <Input type="number" className="w-20" value={i.qty} onChange={e=>updateQty(i.sku, parseInt(e.target.value||'0'))} />
                </div>
              ))}
            </div>
          </Card>
          <Totals items={items} baseUrl={baseUrl} />
        </div>
      </div>
    </Layout>
  )
}

function Totals({items, baseUrl}){
  const [summary,setSummary] = useState({subtotal:0,discount:0,tax:0,total:0})
  useEffect(()=>{(async()=>{
    const res = await fetch(`${baseUrl}/api/orders/preview`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items, discount:0, tax_rate:0.1})})
    const data = await res.json()
    setSummary(data)
  })()},[JSON.stringify(items)])

  return (
    <Card>
      <div className="space-y-1 text-sm">
        <Row label="Subtotal" value={`$${summary.subtotal?.toFixed?.(2) || summary.subtotal}`}/>
        <Row label="Tax" value={`$${summary.tax?.toFixed?.(2) || summary.tax}`}/>
        <Row label="Total" value={`$${summary.total?.toFixed?.(2) || summary.total}`} bold/>
      </div>
      <a href="/checkout" className="block mt-3">
        <Button className="w-full">Proceed to Checkout</Button>
      </a>
    </Card>
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
