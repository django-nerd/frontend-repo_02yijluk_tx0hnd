import { useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { Button, Card, Badge, Input } from '../components/UI'
import { SalesLine, UnitsBar } from '../components/Charts'

const roleColors = { buyer:'blue', reseller:'mint', admin:'pink', owner:'yellow' }

export default function Dashboard(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [role,setRole] = useState('buyer')
  const [metrics,setMetrics] = useState({cards:[]})
  const [series,setSeries] = useState([])

  useEffect(()=>{(async()=>{
    const m = await fetch(`${baseUrl}/api/metrics`).then(r=>r.json())
    const s = await fetch(`${baseUrl}/api/sales`).then(r=>r.json())
    setMetrics(m)
    setSeries(s.series)
  })()},[])

  const [metricKey,setMetricKey] = useState('gross')

  const canAdmin = role==='admin' || role==='owner'

  return (
    <Layout>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm">Role</span>
          {['buyer','reseller','admin','owner'].map(r=> (
            <button key={r} onClick={()=>setRole(r)} className={`px-3 py-1.5 rounded-[12px] ${role===r? 'bg-[#A9D5F9]':'bg-slate-100'}`}>{r}</button>
          ))}
        </div>
      </div>

      <section className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.cards.map((c,i)=> (
          <Card key={i}>
            <p className="text-sm text-slate-600">{c.label}</p>
            <p className="text-2xl font-bold">{typeof c.value==='number' ? c.value.toLocaleString() : c.value}</p>
            {typeof c.trend==='number' && <p className={`text-xs ${c.trend>=0?'text-emerald-600':'text-rose-600'}`}>{c.trend}%</p>}
          </Card>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Sales (30d)</h3>
            <div className="flex items-center gap-2 text-sm">
              {['gross','net','units'].map(k=> (
                <button key={k} onClick={()=>setMetricKey(k)} className={`px-2 py-1 rounded-[12px] ${metricKey===k? 'bg-[#F9A8D4]':'bg-slate-100'}`}>{k}</button>
              ))}
            </div>
          </div>
          <SalesLine data={series} metric={metricKey==='units'? 'gross': metricKey} />
          <div className="mt-2">
            <UnitsBar data={series} />
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2">Auto Payment</h3>
          <div className="flex items-center justify-between">
            <p>Status</p>
            <Badge color="mint">Operational</Badge>
          </div>
          {canAdmin && (
            <div className="mt-3">
              <Button variant="tertiary" className="w-full">Toggle Auto-Capture</Button>
            </div>
          )}
          <div className="mt-3 text-sm text-slate-600">
            <p>Last payments</p>
            <ul className="list-disc ml-4">
              <li>INV-1042 • PayPal • $12.49 • Success</li>
              <li>INV-1041 • Robux • $6.00 • Success</li>
            </ul>
          </div>
        </Card>
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold mb-2">Sales table</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr>
                  {['Date/Time','Product','Reseller','Buyer','Price','Discount','Status','Method'].map(h=> <th key={h} className="text-left p-2">{h}</th> )}
                </tr>
              </thead>
              <tbody>
                {series.slice(0,12).map((s,i)=> (
                  <tr key={i} className="border-t">
                    <td className="p-2">{s.date} 12:{(10+i).toString().padStart(2,'0')}</td>
                    <td className="p-2">VPS Nano</td>
                    <td className="p-2">reseller{i%4}@site.com</td>
                    <td className="p-2">user****@mail.com</td>
                    <td className="p-2">${(s.gross/100).toFixed(2)}</td>
                    <td className="p-2">-${(s.gross/1000).toFixed(2)}</td>
                    <td className="p-2"><Badge color={i%3===0?'pink':'mint'}>{i%3===0?'Pending':'Paid'}</Badge></td>
                    <td className="p-2">{i%2===0?'PayPal':'Robux'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2">Withdrawals</h3>
          <div className="rounded-[12px] p-3 bg-[#FFF6FB] text-sm">Reseller T+5 payout policy applies.</div>
          {canAdmin && (
            <div className="mt-3 space-y-2">
              <Input placeholder="Amount" />
              <div className="flex gap-2">
                <Button>Approve</Button>
                <Button variant="secondary">Reject</Button>
              </div>
            </div>
          )}
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Logs</h3>
            <div className="flex items-center gap-2 text-sm">
              <Input placeholder="Search" className="w-48" />
              <Button variant="tertiary">Export CSV</Button>
            </div>
          </div>
          <LogTable baseUrl={baseUrl} />
        </Card>
      </section>
    </Layout>
  )
}

function LogTable({baseUrl}){
  const [rows,setRows] = useState([])
  useEffect(()=>{(async()=>{
    const r = await fetch(`${baseUrl}/api/logs`).then(r=>r.json())
    setRows(r.items)
  })()},[])
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 bg-white">
          <tr>
            {['Timestamp','Category','Actor','Description','Related'].map(h=> <th key={h} className="text-left p-2">{h}</th> )}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=> (
            <tr key={i} className="border-t">
              <td className="p-2 whitespace-nowrap">{r.timestamp}</td>
              <td className="p-2">{r.category}</td>
              <td className="p-2">{r.actor}</td>
              <td className="p-2">{r.description}</td>
              <td className="p-2">{r.related_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
