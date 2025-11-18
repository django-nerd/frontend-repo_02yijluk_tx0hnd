import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Button, Card, Input } from '../components/UI'
import { colors } from '../components/Theme'

export default function Order(){
  const [products,setProducts] = useState([])
  const [cart,setCart] = useState({})
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(()=>{(async()=>{
    try{
      const res = await fetch(`${baseUrl}/api/products`)
      const data = await res.json()
      setProducts(data.items || [])
    }catch(e){
      setProducts([])
    }
  })()},[])

  const add = (p)=>{
    setCart(prev=>{
      const ex = prev[p.sku] || {qty:0, unit_price:p.price, title:p.title, sku:p.sku}
      return {...prev, [p.sku]: {...ex, qty: ex.qty+1}}
    })
  }
  const updateQty = (sku,qty)=>{
    setCart(prev=>({...prev,[sku]:{...prev[sku],qty:Math.max(0,Number.isFinite(qty)?qty:0)}}))
  }

  const items = Object.values(cart).filter(i=>i.qty>0)

  return (
    <Layout>
      <div className="space-y-4" aria-label="Order page">
        <header className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight" style={{color: colors.text}}>Order services</h1>
            <p className="text-sm" style={{color: colors.muted}}>Choose products and review your summary.</p>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-base font-semibold" style={{color: colors.text}}>Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map(p=> (
                <Card key={p.sku}>
                  <div className="space-y-1">
                    <h3 className="font-semibold leading-tight" style={{color: colors.text}}>{p.title}</h3>
                    <p className="text-sm" style={{color: colors.muted}}>{p.description}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-semibold" aria-label={`Price ${p.price}`} style={{color: colors.text}}>${p.price}</span>
                    <Button onClick={()=>add(p)} aria-label={`Add ${p.title} to cart`}>Add</Button>
                  </div>
                </Card>
              ))}
              {products.length===0 && (
                <Card>
                  <p className="text-sm" style={{color: colors.muted}}>No products available.</p>
                </Card>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-base font-semibold" style={{color: colors.text}}>Order Summary</h2>
            <Card>
              <div className="space-y-2">
                {items.length===0 && <p className="text-sm" style={{color: colors.muted}}>Your cart is empty</p>}
                {items.map(i=> (
                  <div key={i.sku} className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium leading-tight" style={{color: colors.text}}>{i.title}</p>
                      <p className="text-xs" style={{color: colors.muted}}>${i.unit_price}</p>
                    </div>
                    <label className="sr-only" htmlFor={`qty-${i.sku}`}>Quantity for {i.title}</label>
                    <Input id={`qty-${i.sku}`} type="number" inputMode="numeric" className="w-20" value={i.qty} onChange={e=>updateQty(i.sku, parseInt(e.target.value||'0',10))} />
                  </div>
                ))}
              </div>
            </Card>
            <Totals items={items} baseUrl={baseUrl} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

function Totals({items, baseUrl}){
  const [summary,setSummary] = useState({subtotal:0,discount:0,tax:0,total:0})
  useEffect(()=>{(async()=>{
    try{
      const res = await fetch(`${baseUrl}/api/orders/preview`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items, discount:0, tax_rate:0.1})})
      const data = await res.json()
      setSummary(data)
    }catch(e){
      setSummary({subtotal:0,discount:0,tax:0,total:0})
    }
  })()},[JSON.stringify(items)])

  return (
    <Card aria-label="Totals">
      <div className="space-y-1 text-sm">
        <Row label="Subtotal" value={`$${summary.subtotal?.toFixed?.(2) || summary.subtotal}`}/>
        <Row label="Tax" value={`$${summary.tax?.toFixed?.(2) || summary.tax}`}/>
        <Row label="Total" value={`$${summary.total?.toFixed?.(2) || summary.total}`} bold/>
      </div>
      <a href="/checkout" className="block mt-3" aria-label="Proceed to checkout">
        <Button className="w-full">Proceed to Checkout</Button>
      </a>
    </Card>
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
