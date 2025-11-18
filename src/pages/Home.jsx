import Spline from '@splinetool/react-spline'
import { Button, Card } from '../components/UI'
import Layout from '../components/Layout'
import { colors } from '../components/Theme'

const features = [
  {title:'Blazing VPS',desc:'SSD NVMe, global regions, instant provision',tone:'violet', bg:'#F5F3FF'},
  {title:'Domains',desc:'Simple search, WHOIS privacy, easy DNS',tone:'pink', bg:'#FFF1F2'},
  {title:'Panels',desc:'Game & web panels with refined UX',tone:'sky', bg:'#F0F9FF'},
  {title:'Auto Payment',desc:'Seamless capture, retries, fraud guard',tone:'lemon', bg:'#FFFBEB'},
]

export default function Home(){
  return (
    <Layout>
      <section className="relative rounded-[14px] overflow-hidden">
        <div className="h-[420px] w-full">
          <Spline scene="https://prod.spline.design/8nsoLg1te84JZcE9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(252,250,255,0.9), transparent 40%)' }}></div>
        <div className="absolute inset-x-0 bottom-4 px-4 md:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#FFF1F2', color: '#9D174D', boxShadow:'0 6px 24px rgba(244,114,182,0.25)' }}>New • Pastel Play theme</div>
          <h1 className="text-3xl md:text-5xl font-semibold mb-2">Nimbus</h1>
          <p className="text-slate-600 max-w-2xl">A playful, energetic platform for domains, VPS, and panels — now with candy gradients and soft, cute surfaces.</p>
          <div className="mt-4 flex gap-3">
            <Button variant="candy">Get Started</Button>
            <Button variant="outline">Visit Dashboard</Button>
          </div>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f)=> (
          <Card key={f.title} className="transition-transform hover:-translate-y-0.5" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="h-12 w-12 rounded-[14px]" style={{ background: f.bg, boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.03)' }}/>
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="text-sm text-slate-600">{f.desc}</p>
          </Card>
        ))}
      </section>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i=>(
          <Card key={i} style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFAFF 100%)' }}>
            <h4 className="font-semibold mb-1">Loved by teams</h4>
            <p className="text-sm text-slate-600">“The cute, soft UI makes serious work feel light. Provisioning feels magical.”</p>
          </Card>
        ))}
      </section>

      <section className="mt-12">
        <div className="rounded-[14px] p-6" style={{ background: 'linear-gradient(90deg,#FDE68A 0%, #FCA5A5 50%, #A78BFA 100%)', color:'#0F172A' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">Make it yours</h3>
              <p className="text-sm/relaxed opacity-80">Switch themes, tune colors, and keep the soft, cheerful vibe across your workspace.</p>
            </div>
            <Button variant="secondary" style={{ backgroundColor: '#FFFFFF', borderColor: colors.border, borderRadius: '999px' }}>Customize</Button>
          </div>
        </div>
      </section>
    </Layout>
  )
}
