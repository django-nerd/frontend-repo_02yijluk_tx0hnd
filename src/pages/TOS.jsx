import Layout from '../components/Layout'
import { Card, Button } from '../components/UI'

export default function TOS(){
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <Card>
          <div className="prose max-w-none">
            <h2 className="text-[#F24AA7]">1. Introduction</h2>
            <p>Welcome to CreamyCloud. By using our services (VPS, Domains, Panels), you agree to these terms.</p>
            <h2 className="text-[#F24AA7]">2. Usage</h2>
            <p>Respect fair use and applicable laws. Prohibited content includes malware, spam, and abusive behavior.</p>
            <h2 className="text-[#F24AA7]">3. Billing</h2>
            <p>Invoices are generated at checkout. Auto-payment may be enabled for eligible accounts.</p>
            <h2 className="text-[#F24AA7]">4. Refunds</h2>
            <p>We provide refunds in line with product policies. Domains may be non-refundable after registration.</p>
            <h2 className="text-[#F24AA7]">5. Support</h2>
            <p>Our team provides best-effort support via tickets and email.</p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-5 w-10 appearance-none bg-slate-200 rounded-full relative transition-colors checked:bg-[#A9F9CD]" aria-label="Accept terms" />
              <span className="text-sm">I accept the terms</span>
            </label>
            <Button>Continue</Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
