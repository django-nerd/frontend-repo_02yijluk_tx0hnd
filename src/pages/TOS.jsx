import Layout from '../components/Layout'
import { Card, Button } from '../components/UI'
import { colors } from '../components/Theme'

export default function TOS(){
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4" aria-label="Terms of Service">
        <header>
          <h1 className="text-3xl font-bold tracking-tight mb-2" style={{color: colors.text}}>Terms of Service</h1>
          <p style={{color: colors.muted}}>Please review our terms before using Nimbus services.</p>
        </header>
        <Card>
          <div className="prose max-w-none">
            <h2 style={{color: 'var(--sky)'}}>1. Introduction</h2>
            <p>Welcome to Nimbus. By using our services (VPS, Domains, Panels), you agree to these terms.</p>
            <h2 style={{color: 'var(--sky)'}}>2. Acceptable Use</h2>
            <p>Respect fair use and applicable laws. Prohibited content includes malware, spam, and abusive behavior.</p>
            <h2 style={{color: 'var(--sky)'}}>3. Billing</h2>
            <p>Invoices are generated at checkout. Auto-payment may be enabled for eligible accounts.</p>
            <h2 style={{color: 'var(--sky)'}}>4. Refunds</h2>
            <p>Refunds follow product policies. Domains may be non-refundable after registration.</p>
            <h2 style={{color: 'var(--sky)'}}>5. Support</h2>
            <p>Our team provides best-effort support via tickets and email.</p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-5 w-10 appearance-none rounded-full relative transition-colors" style={{backgroundColor:'color-mix(in oklab, var(--surface) 80%, transparent)'}} aria-label="Accept terms" />
              <span className="text-sm" style={{color: colors.text}}>I accept the terms</span>
            </label>
            <Button aria-label="Continue">Continue</Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
