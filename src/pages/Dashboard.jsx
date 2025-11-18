import { useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { Button, Card, Badge, Input } from '../components/UI'
import { SalesLine, UnitsBar } from '../components/Charts'

const ROLES = ['reseller','admin','investor','engineer','high_admin','owner']

export default function Dashboard(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [role,setRole] = useState('reseller')
  const [email,setEmail] = useState('user@company.com')
  const [metrics,setMetrics] = useState({cards:[]})
  const [series,setSeries] = useState([])
  const [metricKey,setMetricKey] = useState('gross')

  const [autoPay,setAutoPay] = useState({loading:true, enabled:true})
  const [withdraw,setWithdraw] = useState({amount:'', loading:false, result:null, error:''})

  const canViewLogs = ['admin','investor','engineer','owner'].includes(role)
  const canToggleAutoPay = ['admin','high_admin','owner'].includes(role)

  useEffect(()=>{(async()=>{
    try{
      const m = await fetch(`${baseUrl}/api/metrics`).then(r=>r.json())
      const s = await fetch(`${baseUrl}/api/sales`).then(r=>r.json())
      setMetrics(m)
      setSeries(s.series||[])
    }catch(e){
      setMetrics({cards:[]}); setSeries([])
    }
  })()},[])

  useEffect(()=>{(async()=>{
    try{
      setAutoPay(a=>({...a,loading:true}))
      const ap = await fetch(`${baseUrl}/api/settings/auto-payment`).then(r=>r.json())
      setAutoPay({loading:false, enabled: !!ap.enabled})
    }catch(e){ setAutoPay({loading:false, enabled:true}) }
  })()},[])

  async function toggleAutoPayment(){
    try{
      setAutoPay(a=>({...a,loading:true}))
      const res = await fetch(`${baseUrl}/api/settings/auto-payment`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({enabled:!autoPay.enabled})})
      const data = await res.json()
      setAutoPay({loading:false, enabled: !!data.enabled})
    }catch(e){ setAutoPay(a=>({...a,loading:false})) }
  }

  async function submitWithdrawal(){
    setWithdraw(w=>({...w, loading:true, error:'', result:null}))
    try{
      const amountVal = parseFloat(withdraw.amount)
      if(isNaN(amountVal) || amountVal <= 0){
        throw new Error('Masukkan jumlah yang valid')
      }
      const res = await fetch(`${baseUrl}/api/withdrawals`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({actor_email:email, amount:amountVal, role})})
      if(!res.ok){ throw new Error(await res.text() || 'Gagal mengajukan penarikan') }
      const data = await res.json()
      setWithdraw({amount:'', loading:false, error:'', result:data})
    }catch(err){
      setWithdraw(w=>({...w, loading:false, error: err.message || 'Terjadi kesalahan'}))
    }
  }

  return (
    <Layout>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Role</span>
            <div className="flex items-center gap-1">
              {ROLES.map(r=> (
                <button key={r} onClick={()=>setRole(r)} className={`px-3 py-1.5 rounded-[6px] border ${role===r? 'bg-sky-100 border-sky-200':'bg-white border-gray-200 hover:bg-slate-50'}`}>{r.replace('_',' ')}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Email</span>
            <Input value={email} onChange={e=>setEmail(e.target.value)} className="w-56"/>
          </div>
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
                <button key={k} onClick={()=>setMetricKey(k)} className={`px-2 py-1 rounded-[6px] border ${metricKey===k? 'bg-pink-100 border-pink-200':'bg-white border-gray-200 hover:bg-slate-50'}`}>{k}</button>
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
          <div className="flex items-center justify-between text-sm">
            <p>Status</p>
            <Badge color={autoPay.enabled? 'green':'yellow'}>{autoPay.loading? 'Loading…' : (autoPay.enabled? 'On':'Off')}</Badge>
          </div>
          {canToggleAutoPay && (
            <div className="mt-3">
              <Button variant="secondary" className="w-full" disabled={autoPay.loading} onClick={toggleAutoPayment}>
                {autoPay.loading? 'Working…' : (autoPay.enabled? 'Turn Off Auto-Capture' : 'Turn On Auto-Capture')}
              </Button>
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
                    <td className="p-2"><Badge color={i%3===0?'yellow':'green'}>{i%3===0?'Pending':'Paid'}</Badge></td>
                    <td className="p-2">{i%2===0?'PayPal':'Robux'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2">Withdrawals</h3>
          {role==='reseller' && (
            <div className="rounded-[6px] p-3 bg-slate-50 text-sm border border-gray-200">Reseller T+5 payout policy applies. Dana cair 5 hari setelah pengajuan.</div>
          )}
          {role==='high_admin' && (
            <div className="rounded-[6px] p-3 bg-slate-50 text-sm border border-gray-200">High admin dapat mencairkan dana secara langsung (instan).</div>
          )}
          <div className="mt-3 space-y-2">
            <Input placeholder="Amount" value={withdraw.amount} onChange={e=>setWithdraw(w=>({...w, amount:e.target.value}))} />
            <Button onClick={submitWithdrawal} disabled={withdraw.loading}>{withdraw.loading? 'Submitting…':'Request Withdrawal'}</Button>
            {withdraw.error && <p className="text-sm text-red-600">{withdraw.error}</p>}
            {withdraw.result && (
              <div className="text-sm text-slate-700 space-y-1">
                <p>Status: <span className="font-medium">{withdraw.result.status}</span></p>
                {withdraw.result.scheduled_date && <p>Scheduled: {new Date(withdraw.result.scheduled_date).toLocaleString()}</p>}
              </div>
            )}
          </div>
        </Card>
      </section>

      {canViewLogs && (
        <section className="mt-6">
          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Logs</h3>
              <div className="flex items-center gap-2 text-sm">
                <Input placeholder="Search" className="w-48" aria-label="Search logs" />
                <Button variant="secondary">Export CSV</Button>
              </div>
            </div>
            <LogTable baseUrl={baseUrl} />
          </Card>
        </section>
      )}
    </Layout>
  )
}

function LogTable({baseUrl}){
  const [rows,setRows] = useState([])
  useEffect(()=>{(async()=>{
    try{
      const r = await fetch(`${baseUrl}/api/logs`).then(r=>r.json())
      setRows(r.items||[])
    }catch(e){ setRows([]) }
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
