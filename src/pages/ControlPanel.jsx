import { useState } from 'react'
import Layout from '../components/Layout'
import { Button, Card, Input, Select, Textarea, Badge } from '../components/UI'
import { colors, radii } from '../components/Theme'
import { Link } from 'react-router-dom'

const TABS = ['Summary','VPS','Domains/DNS','Panels','Billing','Activity']

function Tab({label, active, onClick}){
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={`px-3 py-1.5 rounded-[${radii.pill}] text-sm transition-colors`}
      style={{
        backgroundColor: active ? 'rgba(244,114,182,0.18)' : colors.surface,
        borderColor: active ? 'rgba(244,114,182,0.35)' : colors.border,
        color: colors.text,
        borderWidth: 1,
        borderStyle: 'solid'
      }}
    >{label}</button>
  )
}

export default function ControlPanel(){
  const [tab,setTab] = useState('Summary')

  return (
    <Layout>
      <div className="space-y-4" aria-label="Control Panel">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.text }}>Control Panel</h1>
            <p className="text-sm" style={{ color: colors.muted }}>UI-only preview for managing VPS, domains, and panels.</p>
          </div>
          <div className="flex items-center gap-2 p-1 rounded-[999px] border" style={{ borderColor: colors.border, backgroundColor: colors.surface }} role="tablist" aria-label="Control panel sections">
            {TABS.map(t=> (
              <Tab key={t} label={t} active={tab===t} onClick={()=>setTab(t)} />
            ))}
          </div>
        </header>

        {tab==='Summary' && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <p className="text-sm" style={{ color: colors.muted }}>VPS</p>
              <p className="text-2xl font-bold" style={{ color: colors.text }}>12 Active</p>
              <div className="mt-3 flex items-center gap-2">
                <Button variant="candy">Create VPS</Button>
                <Button variant="secondary">View All</Button>
              </div>
            </Card>
            <Card>
              <p className="text-sm" style={{ color: colors.muted }}>Domains</p>
              <p className="text-2xl font-bold" style={{ color: colors.text }}>7 Managed</p>
              <div className="mt-3 flex items-center gap-2">
                <Button variant="candy">Search Domain</Button>
                <Button variant="secondary">View DNS</Button>
              </div>
            </Card>
            <Card>
              <p className="text-sm" style={{ color: colors.muted }}>Panels</p>
              <p className="text-2xl font-bold" style={{ color: colors.text }}>4 Accounts</p>
              <div className="mt-3 flex items-center gap-2">
                <Button variant="candy">New Account</Button>
                <Button variant="secondary">Manage</Button>
              </div>
            </Card>
          </section>
        )}

        {tab==='VPS' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: colors.text }}>VPS Instances</h2>
              <Button variant="candy">Create VPS</Button>
            </div>
            <Card>
              <div className="overflow-auto" role="region" aria-label="VPS table">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0" style={{ backgroundColor: colors.surface }}>
                    <tr>
                      {['Name','Region','Plan','CPU/RAM','Disk','IP','Status','Actions'].map(h=> <th key={h} className="text-left p-2" style={{ color: colors.muted }}>{h}</th>) }
                    </tr>
                  </thead>
                  <tbody>
                    {['nimbus-01','nimbus-02','db-01','edge-01'].map((name,i)=> (
                      <tr key={name} className="border-t" style={{ borderColor: colors.border }}>
                        <td className="p-2 font-medium" style={{ color: colors.text }}><Link to={`/vps/vm-${(8000+i).toString(16)}`} className="underline decoration-pink-300 underline-offset-2" style={{ color: colors.text }}>{name}</Link></td>
                        <td className="p-2" style={{ color: colors.text }}>FRA{i%2? '1':'3'}</td>
                        <td className="p-2" style={{ color: colors.text }}>Nano</td>
                        <td className="p-2" style={{ color: colors.text }}>2 vCPU / 2 GB</td>
                        <td className="p-2" style={{ color: colors.text }}>40 GB</td>
                        <td className="p-2" style={{ color: colors.text }}>203.0.113.{10+i}</td>
                        <td className="p-2"><Badge color={i%3===0? 'yellow':'green'}>{i%3===0? 'Stopped':'Running'}</Badge></td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Button variant="secondary">Start</Button>
                            <Button variant="secondary">Reboot</Button>
                            <Button variant="secondary">Resize</Button>
                            <Button variant="destructive">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {tab==='Domains/DNS' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: colors.text }}>Domains</h2>
              <div className="flex items-center gap-2">
                <Input placeholder="Search domain" className="w-56"/>
                <Button variant="candy">Add Domain</Button>
              </div>
            </div>
            <Card>
              <div className="overflow-auto" role="region" aria-label="Domains table">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0" style={{ backgroundColor: colors.surface }}>
                    <tr>
                      {['Domain','Expires','Status','Actions'].map(h=> <th key={h} className="text-left p-2" style={{ color: colors.muted }}>{h}</th>) }
                    </tr>
                  </thead>
                  <tbody>
                    {['nimbus.dev','example.cloud','site.fun'].map((d,i)=> (
                      <tr key={d} className="border-t" style={{ borderColor: colors.border }}>
                        <td className="p-2 font-medium" style={{ color: colors.text }}>{d}</td>
                        <td className="p-2" style={{ color: colors.text }}>2026-0{i+5}-12</td>
                        <td className="p-2"><Badge color={i%2? 'green':'blue'}>{i%2? 'Active':'Grace'}</Badge></td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Button variant="secondary">Manage DNS</Button>
                            <Button variant="secondary">Renew</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <h3 className="text-base font-semibold" style={{ color: colors.text }}>DNS Records (nimbus.dev)</h3>
            <Card>
              <div className="overflow-auto" role="region" aria-label="DNS records table">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0" style={{ backgroundColor: colors.surface }}>
                    <tr>
                      {['Type','Name','Value','TTL','Actions'].map(h=> <th key={h} className="text-left p-2" style={{ color: colors.muted }}>{h}</th>) }
                    </tr>
                  </thead>
                  <tbody>
                    {[{t:'A',n:'@',v:'203.0.113.10',ttl:'Auto'},{t:'CNAME',n:'www',v:'@',ttl:'Auto'},{t:'TXT',n:'_acme-challenge',v:'token-abc',ttl:'Auto'}].map((r,i)=> (
                      <tr key={i} className="border-t" style={{ borderColor: colors.border }}>
                        <td className="p-2" style={{ color: colors.text }}>{r.t}</td>
                        <td className="p-2" style={{ color: colors.text }}>{r.n}</td>
                        <td className="p-2" style={{ color: colors.text }}>{r.v}</td>
                        <td className="p-2" style={{ color: colors.text }}>{r.ttl}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Button variant="secondary">Edit</Button>
                            <Button variant="destructive">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-2">
                <Select aria-label="Type"><option>A</option><option>AAAA</option><option>CNAME</option><option>TXT</option><option>MX</option></Select>
                <Input placeholder="Name"/>
                <Input placeholder="Value"/>
                <Select aria-label="TTL"><option>Auto</option><option>300</option><option>600</option></Select>
                <Button variant="candy">Add Record</Button>
              </div>
            </Card>
          </section>
        )}

        {tab==='Panels' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: colors.text }}>Panel Accounts</h2>
              <Button variant="candy">New Account</Button>
            </div>
            <Card>
              <div className="overflow-auto" role="region" aria-label="Panel accounts table">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0" style={{ backgroundColor: colors.surface }}>
                    <tr>
                      {['Username','Type','Quota','Status','Actions'].map(h=> <th key={h} className="text-left p-2" style={{ color: colors.muted }}>{h}</th>) }
                    </tr>
                  </thead>
                  <tbody>
                    {['alpha','beta','gamma'].map((u,i)=> (
                      <tr key={u} className="border-t" style={{ borderColor: colors.border }}>
                        <td className="p-2 font-medium" style={{ color: colors.text }}>{u}</td>
                        <td className="p-2" style={{ color: colors.text }}>Web</td>
                        <td className="p-2" style={{ color: colors.text }}>10 GB</td>
                        <td className="p-2"><Badge color={i%2? 'green':'yellow'}>{i%2? 'Active':'Suspended'}</Badge></td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Button variant="secondary">Reset</Button>
                            <Button variant="secondary">Change Plan</Button>
                            <Button variant="destructive">Suspend</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {tab==='Billing' && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <p className="text-sm" style={{ color: colors.muted }}>Saldo</p>
              <p className="text-2xl font-bold" style={{ color: colors.text }}>Rp 1.250.000</p>
              <Button className="mt-3" variant="candy">Top Up</Button>
            </Card>
            <Card>
              <p className="text-sm" style={{ color: colors.muted }}>Invoices</p>
              <ul className="mt-2 text-sm space-y-1">
                <li className="flex items-center justify-between"><span style={{ color: colors.text }}>INV-1042 • PayPal</span><Badge color="green">Paid</Badge></li>
                <li className="flex items-center justify-between"><span style={{ color: colors.text }}>INV-1041 • Robux</span><Badge color="green">Paid</Badge></li>
                <li className="flex items-center justify-between"><span style={{ color: colors.text }}>INV-1040 • Card</span><Badge color="yellow">Pending</Badge></li>
              </ul>
            </Card>
            <Card>
              <p className="text-sm" style={{ color: colors.muted }}>Promo</p>
              <div className="mt-2 flex items-center gap-2">
                <Input placeholder="Coupon code"/>
                <Button variant="secondary">Apply</Button>
              </div>
            </Card>
          </section>
        )}

        {tab==='Activity' && (
          <section className="space-y-3">
            <Card>
              <div className="flex items-center justify-between mb-2">
                <Input placeholder="Search activity" className="w-56" aria-label="Search activity"/>
                <Button variant="secondary">Export CSV</Button>
              </div>
              <div className="overflow-auto" role="region" aria-label="Activity table">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0" style={{ backgroundColor: colors.surface }}>
                    <tr>
                      {['Time','Actor','Event','Target'].map(h=> <th key={h} className="text-left p-2" style={{ color: colors.muted }}>{h}</th>) }
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({length:8}).map((_,i)=> (
                      <tr key={i} className="border-t" style={{ borderColor: colors.border }}>
                        <td className="p-2 whitespace-nowrap" style={{ color: colors.text }}>2025-01-1{i} 10:{(10+i).toString().padStart(2,'0')}</td>
                        <td className="p-2" style={{ color: colors.text }}>user{i}@site.com</td>
                        <td className="p-2" style={{ color: colors.text }}>create_vps</td>
                        <td className="p-2" style={{ color: colors.text }}>nimbus-0{i}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}
      </div>
    </Layout>
  )
}
