import Spline from '@splinetool/react-spline'
import { Button, Card } from '../components/UI'
import Layout from '../components/Layout'

const features = [
  {title:'Blazing VPS',desc:'SSD NVMe, global regions, instant provision',tone:'blue'},
  {title:'Domains',desc:'Simple search, WHOIS privacy, easy DNS',tone:'muted'},
  {title:'Panels',desc:'Game & web panels with refined UX',tone:'green'},
  {title:'Auto Payment',desc:'Seamless capture, retries, fraud guard',tone:'muted'},
]

export default function Home(){
  return (
    <Layout>
      <section className="relative rounded-[6px] overflow-hidden">
        <div className="h-[420px] w-full">
          <Spline scene="https://prod.spline.design/8nsoLg1te84JZcE9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-4 px-4 md:px-8 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-semibold mb-2">Nimbus</h1>
          <p className="text-slate-600 max-w-2xl">A clean, modern platform for domains, VPS, and panels. Smooth checkout and interactive dashboards included.</p>
          <div className="mt-4 flex gap-3">
            <Button>Get Started</Button>
            <Button variant="outline">Visit Dashboard</Button>
          </div>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f)=> (
          <Card key={f.title} className="transition-colors hover:bg-slate-50">
            <div className="h-10 w-10 rounded-[6px] bg-slate-200"/>
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="text-sm text-slate-600">{f.desc}</p>
          </Card>
        ))}
      </section>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i=>(
          <Card key={i}>
            <h4 className="font-semibold mb-1">Trusted by builders</h4>
            <p className="text-sm text-slate-600">“A fast, clean interface with great dashboards. Provisioning felt effortless.”</p>
          </Card>
        ))}
      </section>
    </Layout>
  )
}
