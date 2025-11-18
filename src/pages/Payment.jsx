import Layout from '../components/Layout'
import { Button, Card } from '../components/UI'
import { Donut } from '../components/Charts'
import { colors, radii } from '../components/Theme'

export default function Payment(){
  const params = new URLSearchParams(window.location.search)
  const method = params.get('method') || 'paypal'
  const oid = params.get('oid')
  const total = parseFloat(params.get('total')||'0')

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4" aria-label="Payment page">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight" style={{color: colors.text}}>Payment</h1>
          <p className="text-sm" style={{color: colors.muted}}>Review and confirm your payment.</p>
        </header>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{color: colors.muted}}>Order</p>
              <p className="font-semibold" style={{color: colors.text}}>{oid}</p>
            </div>
            <div className="text-right">
              <p className="text-sm" style={{color: colors.muted}}>Total</p>
              <p className="font-semibold" style={{color: colors.text}}>${total.toFixed(2)}</p>
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
          <h3 className="font-semibold mb-2" style={{color: colors.text}}>Recent payments</h3>
          <Donut valueA={70} valueB={30} />
        </Card>
      </div>
    </Layout>
  )
}

function Toggle({value, id, label}){
  const active = value===id
  const base = {
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
    color: colors.text,
    backgroundColor: active ? 'rgba(52,211,153,0.15)' : 'color-mix(in oklab, var(--surface) 70%, transparent)'
  }
  return (
    <a href={`?method=${id}`} role="tab" aria-selected={active} className={`px-3 py-1.5`} style={base}>{label}</a>
  )
}
