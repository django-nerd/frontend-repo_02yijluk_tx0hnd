import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { Button, Card, Input, Badge } from '../components/UI'
import { colors, radii } from '../components/Theme'
import { SalesLine, UnitsBar, Donut } from '../components/Charts'

const MOCK = {
  name: 'nimbus-01',
  id: 'vm-8f21a',
  status: 'Running',
  region: 'FRA1',
  ipv4: '203.0.113.10',
  ipv6: '2001:db8::10',
  plan: 'Nano',
  cpu: '2 vCPU',
  ram: '2 GB',
  disk: '40 GB SSD',
  os: 'Ubuntu 22.04 LTS',
  createdAt: '2025-01-05 09:22',
  uptime: '3d 12h',
  ssh: 'ssh ubuntu@203.0.113.10',
}

const usageSeries = Array.from({length: 12}).map((_,i)=>({
  date: `10:${(i*5).toString().padStart(2,'0')}`,
  gross: 40 + (i%5)*10,
  net: 20 + ((i+2)%6)*8
}))

export default function VPSDetail(){
  const { id } = useParams()
  const vm = { ...MOCK, id: id || MOCK.id }

  return (
    <Layout>
      <div className="space-y-4" aria-label="VPS Detail">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{vm.name}</h1>
            <p className="text-sm text-slate-600">Instance • {vm.id} • {vm.region}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary">Reboot</Button>
            <Button variant="secondary">Resize</Button>
            <Button variant="destructive">Power Off</Button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">Status</p>
              <Badge color={vm.status==='Running'? 'green':'yellow'}>{vm.status}</Badge>
            </div>
            <div className="mt-2 text-sm space-y-1">
              <p><span className="text-slate-500">Uptime:</span> {vm.uptime}</p>
              <p><span className="text-slate-500">OS:</span> {vm.os}</p>
              <p><span className="text-slate-500">Plan:</span> {vm.plan}</p>
              <p><span className="text-slate-500">CPU/RAM:</span> {vm.cpu} / {vm.ram}</p>
              <p><span className="text-slate-500">Disk:</span> {vm.disk}</p>
            </div>
            <div className="mt-3">
              <Button variant="candy" className="w-full">Open Console</Button>
            </div>
          </Card>
          <Card>
            <p className="text-sm text-slate-600">Networking</p>
            <div className="mt-2 text-sm space-y-1">
              <p><span className="text-slate-500">IPv4:</span> {vm.ipv4}</p>
              <p><span className="text-slate-500">IPv6:</span> {vm.ipv6}</p>
              <p><span className="text-slate-500">SSH:</span> <code className="px-2 py-1 rounded" style={{backgroundColor: colors.bg, borderRadius: radii.base, border:`1px solid ${colors.border}`}}>{vm.ssh}</code></p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button variant="secondary">Firewall</Button>
              <Button variant="secondary">Floating IP</Button>
            </div>
          </Card>
          <Card>
            <p className="text-sm text-slate-600">Snapshots</p>
            <ul className="mt-2 text-sm space-y-1">
              <li className="flex items-center justify-between"><span>pre-upgrade</span><span className="text-slate-500">2025-01-05</span></li>
              <li className="flex items-center justify-between"><span>clean-install</span><span className="text-slate-500">2025-01-03</span></li>
            </ul>
            <Button className="mt-3" variant="secondary">Create Snapshot</Button>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold">System Resources</h2>
              <div className="flex items-center gap-2">
                <Badge color="blue">Live</Badge>
                <Input aria-label="Time range" className="w-32" placeholder="Last 1h" />
              </div>
            </div>
            <SalesLine data={usageSeries} metric="gross" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <UnitsBar data={usageSeries.map(d=>({date:d.date, units:d.gross}))} />
              <Donut valueA={65} valueB={35} />
            </div>
          </Card>
          <Card>
            <h2 className="text-base font-semibold mb-2">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary">Reset Root</Button>
              <Button variant="secondary">Rebuild</Button>
              <Button variant="secondary">Resize</Button>
              <Button variant="secondary">Enable Backups</Button>
              <Button variant="secondary">Add Volume</Button>
              <Button variant="secondary">Graphs</Button>
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <h2 className="text-base font-semibold mb-2">Console (Preview)</h2>
            <div className="h-56 rounded border text-xs p-3 font-mono overflow-auto" style={{borderColor: colors.border, backgroundColor: '#0b1020', color:'#d1d5db'}} aria-label="Terminal preview">
              <div className="opacity-70">Connecting to {vm.name}...</div>
              <pre className="mt-2">{`Welcome to Ubuntu 22.04.4 LTS (GNU/Linux 5.15.0-1058-gcp x86_64)
Last login: Tue Jan 14 10:22:01 2025 from 198.51.100.5
ubuntu@${vm.name}:~$ top -b -n1 | head -5
%Cpu(s):  12.3 us,   2.0 sy,   0.0 ni,  85.2 id,   0.3 wa,   0.0 hi,   0.2 si,   0.0 st
MiB Mem :   1992.0 total,    412.5 free,    733.4 used,    846.1 buff/cache
ubuntu@${vm.name}:~$`}</pre>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Button variant="secondary">Open Full Console</Button>
              <Button variant="secondary">Copy SSH</Button>
            </div>
          </Card>
          <Card>
            <h2 className="text-base font-semibold mb-2">Disks & Volumes</h2>
            <div className="text-sm">
              <div className="flex items-center justify-between py-2 border-b" style={{borderColor: colors.border}}>
                <div>
                  <p className="font-medium">/dev/sda</p>
                  <p className="text-slate-500">Root • 40 GB</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary">Expand</Button>
                  <Button variant="secondary">Detach</Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Volume-1</p>
                  <p className="text-slate-500">Data • 20 GB</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary">Mount</Button>
                  <Button variant="secondary">Delete</Button>
                </div>
              </div>
              <Button variant="candy" className="mt-2">Add Volume</Button>
            </div>
          </Card>
        </section>

        <div className="flex items-center justify-between">
          <Link to="/control" className="text-sm underline">Back to Control Panel</Link>
          <div className="text-xs text-slate-500">Created {vm.createdAt}</div>
        </div>
      </div>
    </Layout>
  )
}
