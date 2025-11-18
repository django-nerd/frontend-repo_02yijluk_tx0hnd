import Layout from '../components/Layout'
import { Button, Card } from '../components/UI'
import { Donut } from '../components/Charts'

export default function Payment(){
  const params = new URLSearchParams(window.location.search)
  const method = params.get('method') || 'paypal'
  const oid = params.get('oid')
  const total = parseFloat(params.get('total')||'0')

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4" aria-label="Payment page">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Payment</h1>
          <p className="text-sm text-slate-600">Review and confirm your payment.</p>
        </header>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Order</p>
              <p className="font-semibold">{oid}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-600 text-sm">Total</p>
              <p className="font-semibold">${total.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2" role="tablist" aria-label="Payment methods">
            <Toggle value={method} label="Robux" id="robux" />
            <Toggle value={method} label="PayPal" id="paypal" />
            <Toggle value={method} label="Manual" id="manual" />
          </div>
          <div className="mt-4">
            <Button className="w-full" aria-label="Confirm and pay">Confirm and Pay</Button>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2">Recent payments</h3>
          <Donut valueA={70} valueB={30} />
        </Card>
      </div>
    </Layout>
  )
}

function Toggle({value, id, label}){
  const active = value===id
  return (
    <a href={`?method=${id}`} role="tab" aria-selected={active} className={`px-3 py-1.5 rounded-[12px] ${active? 'bg-emerald-100 text-emerald-800 border border-emerald-200':'bg-slate-100 text-slate-700 border border-slate-200'}`}>{label}</a>
  )
}
