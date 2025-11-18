import { useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { Button, Card, Badge, Input, Select, Textarea } from '../components/UI'
import { colors, radii } from '../components/Theme'
import { SalesLine, UnitsBar } from '../components/Charts'

const ROLES = ['reseller','admin','investor','engineer','high_admin','owner']

function SectionTitle({id, emoji, title, hint}){
  return (
    <div id={id} className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-semibold flex items-center gap-2" style={{color: colors.text}}>
        <span aria-hidden className="text-base">{emoji}</span>
        {title}
      </h2>
      {hint && <span className="text-xs" style={{color: colors.muted}}>{hint}</span>}
    </div>
  )
}

export default function Dashboard(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [role,setRole] = useState('reseller')
  const [email,setEmail] = useState('user@company.com')
  const [metrics,setMetrics] = useState({cards:[]})
  const [series,setSeries] = useState([])
  const [metricKey,setMetricKey] = useState('gross')

  const [autoPay,setAutoPay] = useState({loading:true, enabled:true})
  const [withdraw,setWithdraw] = useState({amount:'', loading:false, result:null, error:''})

  // Visibility by role
  const canViewLogs = ['admin','investor','engineer','high_admin','owner'].includes(role)
  const canUseAutoPayToggle = ['admin','high_admin','owner'].includes(role)
  const showAutoPayStatus = canUseAutoPayToggle || role==='engineer'
  const showProducts = ['admin','high_admin','owner'].includes(role)
  const showPaymentsMenu = ['admin','high_admin','owner'].includes(role)
  const showSystem = ['engineer','owner'].includes(role)
  const showUsersRoles = ['owner'].includes(role)

  // Sidebar items by role
  const sidebarItems = useMemo(()=>{
    switch(role){
      case 'reseller':
        return [
          {id:'overview', label:'Overview'},
          {id:'sales', label:'Penjualan'},
          {id:'withdrawals', label:'Pencairan'},
          {id:'payments', label:'Pembayaran'},
          {id:'settings', label:'Settings'},
        ]
      case 'admin':
        return [
          {id:'overview', label:'Overview'},
          {id:'sales', label:'Penjualan'},
          {id:'payments', label:'Pembayaran'},
          {id:'withdrawals', label:'Pencairan'},
          {id:'products', label:'Produk'},
          {id:'logs', label:'Logs'},
        ]
      case 'investor':
        return [
          {id:'overview', label:'Overview'},
          {id:'sales', label:'Penjualan'},
          {id:'logs', label:'Logs'},
        ]
      case 'engineer':
        return [
          {id:'overview', label:'Overview'},
          {id:'system', label:'Sistem'},
          {id:'logs', label:'Logs'},
        ]
      case 'high_admin':
        return [
          {id:'overview', label:'Overview'},
          {id:'sales', label:'Penjualan'},
          {id:'payments', label:'Pembayaran'},
          {id:'withdrawals', label:'Pencairan'},
          {id:'products', label:'Produk'},
          {id:'logs', label:'Logs'},
          {id:'settings', label:'Settings'},
        ]
      case 'owner':
        return [
          {id:'overview', label:'Overview'},
          {id:'sales', label:'Penjualan'},
          {id:'payments', label:'Pembayaran'},
          {id:'withdrawals', label:'Pencairan'},
          {id:'products', label:'Produk'},
          {id:'system', label:'Sistem'},
          {id:'users', label:'Users/Roles'},
          {id:'logs', label:'Logs'},
          {id:'settings', label:'Settings'},
        ]
      default:
        return []
    }
  },[role])

  useEffect(()=>{(async()=>{
    try{
      const m = await fetch(`${baseUrl}/api/metrics`).then(r=>r.json())
      const s = await fetch(`${baseUrl}/api/sales`).then(r=>r.json())
      setMetrics(m)
      setSeries(s.series||[])
    }catch(e){
      setMetrics({cards:[
        {label:'Total Penjualan', value:'–'},
        {label:'Saldo', value:'–'},
        {label:'Konversi', value:'–'},
      ]}); setSeries([])
    }
  })()},[])

  useEffect(()=>{(async()=>{
    if(!showAutoPayStatus) return
    try{
      setAutoPay(a=>({...a,loading:true}))
      const ap = await fetch(`${baseUrl}/api/settings/auto-payment`).then(r=>r.json())
      setAutoPay({loading:false, enabled: !!ap.enabled})
    }catch(e){ setAutoPay({loading:false, enabled:true}) }
  })()},[showAutoPayStatus])

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

  function Chip({active, children, onClick}){
    const baseStyle = {
      borderColor: colors.border,
      borderRadius: radii.pill,
      color: colors.text,
      backgroundColor: active ? 'rgba(244,114,182,0.15)' : 'transparent'
    }
    return (
      <button onClick={onClick} className={`px-3 py-1.5 border text-sm transition-colors`} style={baseStyle}>{children}</button>
    )
  }

  return (
    <Layout>
      {/* Top controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold" style={{color: colors.text}}>Dashboard</h1>
          <Badge color="muted">Playful Pastel</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{color: colors.muted}}>Role</span>
            <div className="flex items-center gap-1 p-1 rounded-[999px] border" style={{ borderColor: colors.border, backgroundColor: colors.surface }} role="tablist" aria-label="Select role">
              {ROLES.map(r=> (
                <Chip key={r} active={role===r} onClick={()=>setRole(r)}>{r.replace('_',' ')}</Chip>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{color: colors.muted}}>Email</span>
            <Input aria-label="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-56"/>
          </div>
        </div>
      </div>

      {/* Layout: sidebar + content */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <Card className="p-0">
            <nav aria-label="Dashboard sections" className="p-2">
              <ul className="space-y-1">
                {sidebarItems.map(it=> (
                  <li key={it.id}>
                    <a href={`#${it.id}`} className={`flex items-center justify-between px-3 py-2`} style={{borderRadius: radii.pill, color: colors.text}}
                      onMouseOver={e=> e.currentTarget.style.backgroundColor='rgba(244,114,182,0.12)'}
                      onMouseOut={e=> e.currentTarget.style.backgroundColor='transparent'}
                    >{it.label}<span aria-hidden>›</span></a>
                  </li>
                ))}
              </ul>
            </nav>
          </Card>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-9 space-y-8">
          {/* Overview / Metrics */}
          <section>
            <SectionTitle id="overview" emoji="🎈" title="Overview" hint={roleLabel(role)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {metrics.cards.map((c,i)=> (
                <Card key={i}>
                  <p className="text-sm" style={{color: colors.muted}}>{c.label}</p>
                  <p className="text-2xl font-bold" style={{color: colors.text}}>{typeof c.value==='number' ? c.value.toLocaleString() : c.value}</p>
                  {typeof c.trend==='number' && <p className="text-xs" style={{color: c.trend>=0? 'rgb(5, 150, 105)':'rgb(225, 29, 72)'}}>{c.trend}%</p>}
                </Card>
              ))}
              {showAutoPayStatus && (
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{color: colors.muted}}>Auto Payment</p>
                      <p className="text-2xl font-bold" style={{color: colors.text}}>{autoPay.loading? '...' : (autoPay.enabled? 'On' : 'Off')}</p>
                    </div>
                    <Badge color={autoPay.enabled? 'green':'yellow'}>{autoPay.loading? 'Loading…' : (autoPay.enabled? 'Aktif':'Nonaktif')}</Badge>
                  </div>
                  {canUseAutoPayToggle && (
                    <Button variant="secondary" className="mt-3 w-full" disabled={autoPay.loading} onClick={toggleAutoPayment}>
                      {autoPay.loading? 'Working…' : (autoPay.enabled? 'Turn Off Auto-Capture' : 'Turn On Auto-Capture')}
                    </Button>
                  )}
                  {role==='engineer' && (
                    <p className="mt-2 text-sm" style={{color: colors.muted}}>Gateway & webhook health di bagian Sistem.</p>
                  )}
                </Card>
              )}
            </div>
          </section>

          {/* Charts */}
          <section>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <Card className="xl:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold" style={{color: colors.text}}>Sales (30d)</h3>
                  <div className="flex items-center gap-2 text-sm p-1 rounded-[999px] border" style={{borderColor: colors.border, backgroundColor: colors.surface}} role="tablist" aria-label="Metric">
                    {['gross','net','units'].map(k=> (
                      <Chip key={k} active={metricKey===k} onClick={()=>setMetricKey(k)}>{k}</Chip>
                    ))}
                  </div>
                </div>
                <SalesLine data={series} metric={metricKey==='units'? 'gross': metricKey} />
                <div className="mt-2">
                  <UnitsBar data={series} />
                </div>
              </Card>
              {showAutoPayStatus && (
                <Card>
                  <h3 className="font-semibold mb-2" style={{color: colors.text}}>Recent Payments</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center justify-between"><span>INV-1042 • PayPal</span><Badge color="green">Success</Badge></li>
                    <li className="flex items-center justify-between"><span>INV-1041 • Robux</span><Badge color="green">Success</Badge></li>
                    <li className="flex items-center justify-between"><span>INV-1040 • Card</span><Badge color="yellow">Pending</Badge></li>
                  </ul>
                </Card>
              )}
            </div>
          </section>

          {/* Sales section */}
          <section>
            <SectionTitle id="sales" emoji="🍬" title="Penjualan" hint={salesHint(role)} />

            {/* Filters for non-reseller roles */}
            {['admin','high_admin','owner','investor'].includes(role) && (
              <Card className="mb-3">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  <Input aria-label="Tanggal" placeholder="Tanggal (range)"/>
                  <Input aria-label="Reseller" placeholder="Reseller"/>
                  <Input aria-label="Produk" placeholder="Produk"/>
                  <Select aria-label="Status"><option>Status</option><option>Paid</option><option>Pending</option><option>Failed</option></Select>
                  <Select aria-label="Metode"><option>Metode</option><option>PayPal</option><option>Robux</option><option>Card</option></Select>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary">Filter</Button>
                    {['admin','high_admin','owner'].includes(role) && (
                      <Button variant="candy">Export CSV</Button>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* CTA for reseller */}
            {role==='reseller' && (
              <div className="flex items-center gap-2 mb-2">
                <Button variant="candy">Tambah Penjualan</Button>
                <Button variant="secondary" onClick={()=>document.getElementById('withdrawals')?.scrollIntoView({behavior:'smooth'})}>Ajukan Pencairan</Button>
              </div>
            )}

            <Card>
              <div className="overflow-auto" role="region" aria-label="Tabel Penjualan">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0" style={{backgroundColor: colors.surface}}>
                    <tr>
                      {['Date/Time','Product','Reseller','Buyer','Price','Discount','Status','Method'].map(h=> <th key={h} className="text-left p-2" style={{color: colors.muted, borderBottom: `1px solid ${getVar('border')}`}}>{h}</th> )}
                    </tr>
                  </thead>
                  <tbody>
                    {series.slice(0,12).map((s,i)=> (
                      <tr key={i} className="border-t" style={{borderColor: colors.border}}>
                        <td className="p-2">{s.date} 12:{(10+i).toString().padStart(2,'0')}</td>
                        <td className="p-2">VPS Nano</td>
                        <td className="p-2">{role==='reseller'? email : `reseller${i%4}@site.com`}</td>
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
              {['admin','high_admin','owner'].includes(role) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button variant="secondary">Kelola Harga</Button>
                  <Button variant="candy">Export CSV</Button>
                </div>
              )}
            </Card>
          </section>

          {/* Withdrawals */}
          <section>
            <SectionTitle id="withdrawals" emoji="💸" title="Pencairan" hint={withdrawHint(role)} />
            {role==='reseller' && (
              <div className={`rounded-[${radii.base}] p-3 border`} style={{backgroundColor:'rgba(251,191,36,0.12)', borderColor:'rgba(251,191,36,0.35)'}}>
                <p className="text-sm" style={{color: colors.text}}>Kebijakan T+5 berlaku. Dana cair 5 hari setelah pengajuan.</p>
              </div>
            )}

            <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left: form or info */}
              <Card className="lg:col-span-1">
                {role==='reseller' && (
                  <div className="space-y-2">
                    <Input placeholder="Jumlah (IDR)" value={withdraw.amount} onChange={e=>setWithdraw(w=>({...w, amount:e.target.value}))} />
                    <Textarea placeholder="Catatan (opsional)"/>
                    <Button onClick={submitWithdrawal} disabled={withdraw.loading}>{withdraw.loading? 'Submitting…':'Ajukan Pencairan'}</Button>
                    {withdraw.error && <p className="text-sm" style={{color: 'rgb(220,38,38)'}}>{withdraw.error}</p>}
                    {withdraw.result && (
                      <div className="text-sm" style={{color: colors.text}}>
                        <p>Status: <span className="font-medium">{withdraw.result.status}</span></p>
                        {withdraw.result.scheduled_date && <p style={{color: colors.muted}}>Estimasi Cair: {new Date(withdraw.result.scheduled_date).toLocaleString()}</p>}
                      </div>
                    )}
                  </div>
                )}
                {['admin'].includes(role) && (
                  <p className="text-sm" style={{color: colors.muted}}>Lihat pengajuan untuk review. Approval mengikuti kebijakan T+5.</p>
                )}
                {['high_admin','owner'].includes(role) && (
                  <p className="text-sm" style={{color: colors.muted}}>Anda dapat melakukan cairkan instan, approve/reject, dan unggah bukti pembayaran.</p>
                )}
              </Card>

              {/* Right: table */}
              <Card className="lg:col-span-2">
                <div className="overflow-auto" role="region" aria-label="Daftar Pengajuan Pencairan">
                  <table className="min-w-full text-sm">
                    <thead className="sticky top-0" style={{backgroundColor: colors.surface}}>
                      <tr>
                        {['Tanggal','Reseller','Amount','Estimasi Cair','Status','Bukti','Aksi'].map(h=> <th key={h} className="text-left p-2" style={{color: colors.muted, borderBottom: `1px solid ${getVar('border')}`}}>{h}</th> )}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({length:6}).map((_,i)=> (
                        <tr key={i} className="border-t" style={{borderColor: colors.border}}>
                          <td className="p-2 whitespace-nowrap">2025-01-{(10+i).toString().padStart(2,'0')}</td>
                          <td className="p-2">reseller{i}@site.com</td>
                          <td className="p-2">Rp {((i+1)*250_000).toLocaleString('id-ID')}</td>
                          <td className="p-2 whitespace-nowrap">2025-01-{(15+i).toString().padStart(2,'0')}</td>
                          <td className="p-2"><Badge color={i%3===0?'yellow':'green'}>{i%3===0?'Pending':'Approved'}</Badge></td>
                          <td className="p-2"><Button variant="secondary">Lihat</Button></td>
                          <td className="p-2">
                            {role==='admin' && (
                              <span className="text-xs" style={{color: colors.muted}}>Read-only</span>
                            )}
                            {['high_admin','owner'].includes(role) && (
                              <div className="flex items-center gap-2">
                                <Button variant="secondary">Approve</Button>
                                <Button variant="secondary">Reject</Button>
                                <Button variant="candy">Cairkan Sekarang</Button>
                              </div>
                            )}
                            {role==='reseller' && (
                              <span className="text-xs" style={{color: colors.muted}}>Menunggu verifikasi</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </section>

          {/* Payments / Auto Payment */}
          {showPaymentsMenu && (
            <section>
              <SectionTitle id="payments" emoji="💳" title="Pembayaran" hint="Gateway & Auto-Capture" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <h3 className="font-semibold mb-2" style={{color: colors.text}}>Auto Payment</h3>
                  <div className="flex items-center justify-between text-sm">
                    <p style={{color: colors.muted}}>Status</p>
                    <Badge color={autoPay.enabled? 'green':'yellow'}>{autoPay.loading? 'Loading…' : (autoPay.enabled? 'On':'Off')}</Badge>
                  </div>
                  <div className="mt-3">
                    <Button variant="secondary" className="w-full" disabled={autoPay.loading} onClick={toggleAutoPayment}>
                      {autoPay.loading? 'Working…' : (autoPay.enabled? 'Turn Off Auto-Capture' : 'Turn On Auto-Capture')}
                    </Button>
                  </div>
                </Card>
                <Card>
                  <h3 className="font-semibold mb-2" style={{color: colors.text}}>Gateway Status</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center justify-between"><span>PayPal</span><Badge color="green">Healthy</Badge></li>
                    <li className="flex items-center justify-between"><span>Robux</span><Badge color="green">Healthy</Badge></li>
                    <li className="flex items-center justify-between"><span>Card</span><Badge color="yellow">Degraded</Badge></li>
                  </ul>
                </Card>
              </div>
            </section>
          )}

          {/* Products (for admin/high_admin/owner) */}
          {showProducts && (
            <section>
              <SectionTitle id="products" emoji="🧁" title="Produk" hint="Kelola produk & harga" />
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['VPS Nano','VPS Pro','Domain .com'].map((p,i)=> (
                    <Card key={i}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium" style={{color: colors.text}}>{p}</p>
                          <p className="text-sm" style={{color: colors.muted}}>Harga mulai Rp {(15000*(i+1)).toLocaleString('id-ID')}</p>
                        </div>
                        <Badge color={i%2? 'green':'blue'}>{i%2? 'Active':'Draft'}</Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Button variant="secondary">Edit</Button>
                        <Button variant="candy">Kelola Harga</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </section>
          )}

          {/* System (for engineer/owner) */}
          {showSystem && (
            <section>
              <SectionTitle id="system" emoji="🧩" title="Sistem" hint="Status & incident" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <h3 className="font-semibold" style={{color: colors.text}}>Uptime</h3>
                  <p className="text-sm" style={{color: colors.muted}}>99.95% • 30d</p>
                </Card>
                <Card>
                  <h3 className="font-semibold" style={{color: colors.text}}>Provisioning Queue</h3>
                  <p className="text-sm" style={{color: colors.muted}}>3 pending • avg 12s</p>
                </Card>
                <Card>
                  <h3 className="font-semibold" style={{color: colors.text}}>Webhook Status</h3>
                  <p className="text-sm" style={{color: colors.muted}}>PayPal OK • Robux OK • Card Delayed</p>
                </Card>
              </div>
            </section>
          )}

          {/* Users/Roles (owner) */}
          {showUsersRoles && (
            <section>
              <SectionTitle id="users" emoji="🫶" title="Users & Roles" hint="Role management" />
              <Card>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="md:w-1/3 space-y-2">
                    <Input placeholder="Cari pengguna"/>
                    <ul className="space-y-1 text-sm">
                      {['maya@site.com','irfan@site.com','lina@site.com'].map(u=> (
                        <li key={u} className={`px-3 py-2`} style={{borderRadius: radii.base, border: `1px solid ${getVar('border')}`}}>{u}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:flex-1 space-y-2">
                    <p className="font-medium" style={{color: colors.text}}>Detail Pengguna</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input placeholder="Email" defaultValue="maya@site.com"/>
                      <Select defaultValue="reseller"><option value="reseller">Reseller</option><option value="admin">Admin</option><option value="engineer">Engineer</option><option value="owner">Owner</option></Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary">Simpan</Button>
                      <Button variant="destructive">Nonaktifkan</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          )}

          {/* Logs */}
          {canViewLogs && (
            <section>
              <SectionTitle id="logs" emoji="📜" title="Logs" hint={role==='investor' ? 'Read-only' : 'Full access'} />
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <Input placeholder="Search" className="w-48" aria-label="Search logs" />
                  <div className="flex items-center gap-2 text-sm">
                    <Button variant="secondary">Export CSV</Button>
                  </div>
                </div>
                <LogTable baseUrl={baseUrl} />
              </Card>
            </section>
          )}

          {/* Settings (subset per role) */}
          {['reseller','high_admin','owner'].includes(role) && (
            <section>
              <SectionTitle id="settings" emoji="⚙️" title="Settings" hint={role==='reseller'? 'Profil, notifikasi, password' : 'Produk & sistem'} />
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="font-medium mb-1" style={{color: colors.text}}>Profil</p>
                    <Input placeholder="Nama" defaultValue="Nimbus User"/>
                    <Input className="mt-2" placeholder="Email" defaultValue={email}/>
                  </div>
                  <div>
                    <p className="font-medium mb-1" style={{color: colors.text}}>Notifikasi</p>
                    <div className="flex items-center gap-2 text-sm" style={{color: colors.text}}>
                      <input id="notif-email" type="checkbox" defaultChecked className="accent-pink-400"/>
                      <label htmlFor="notif-email">Email</label>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1" style={{color: colors.text}}>
                      <input id="notif-telegram" type="checkbox" className="accent-violet-400"/>
                      <label htmlFor="notif-telegram">Telegram</label>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-1" style={{color: colors.text}}>Password</p>
                    <Input type="password" placeholder="Password baru"/>
                    <Button className="mt-2" variant="secondary">Update</Button>
                  </div>
                </div>
              </Card>
            </section>
          )}
        </div>
      </div>
    </Layout>
  )
}

function getVar(name){
  // Helper for inline border references
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim() || 'rgba(0,0,0,0.1)'
}

function roleLabel(role){
  switch(role){
    case 'reseller': return 'Reseller view: penjualan pribadi & pencairan'
    case 'admin': return 'Admin view: seluruh reseller + pembayaran'
    case 'investor': return 'Investor view: MRR/Revenue & logs (read-only)'
    case 'engineer': return 'Engineer view: sistem & webhook health'
    case 'high_admin': return 'High Admin view: kontrol pencairan instan'
    case 'owner': return 'Owner view: full access termasuk roles & sistem'
    default: return ''
  }
}

function salesHint(role){
  if(role==='reseller') return 'Tabel penjualan pribadi'
  if(['investor'].includes(role)) return 'Read-only penjualan & filter'
  if(['admin','high_admin','owner'].includes(role)) return 'Semua reseller, filter lengkap'
  return ''
}

function withdrawHint(role){
  if(role==='reseller') return 'Ajukan pencairan (T+5)'
  if(role==='admin') return 'Review pengajuan (read-only/T+5)'
  if(['high_admin','owner'].includes(role)) return 'Approve/Reject/Instant + upload bukti'
  return ''
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
        <thead className="sticky top-0" style={{backgroundColor: colors.surface}}>
          <tr>
            {['Timestamp','Category','Actor','Description','Related'].map(h=> <th key={h} className="text-left p-2" style={{color: colors.muted, borderBottom: `1px solid ${getVar('border')}`}}>{h}</th> )}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=> (
            <tr key={i} className="border-t" style={{borderColor: colors.border}}>
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
