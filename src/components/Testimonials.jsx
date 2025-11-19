import { colors } from './Theme'
import { Card, Button } from './UI'

const items = [
  {
    name: 'Arif Pratama',
    role: 'Founder, Kopi.dev',
    quote:
      'Migrasi ke Nimbus itu mudah banget. Performa VPS-nya ngebut dan dukungan 24/7 beneran responsif.',
  },
  {
    name: 'Nadia Putri',
    role: 'CTO, BelanjaQ',
    quote:
      'Panelnya simpel tapi powerful. Tim kami bisa rilis lebih cepat tanpa drama infrastruktur.',
  },
  {
    name: 'William Hartono',
    role: 'Indie Hacker',
    quote:
      'Harga masuk akal, network kencang, backup harian bikin tidur nyenyak.',
  },
]

export default function Testimonials(){
  return (
    <section aria-label="Testimoni pelanggan" className="relative mt-20 md:mt-28 max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h3 className="text-xl md:text-2xl font-semibold" style={{ color: colors.text }}>Apa kata mereka</h3>
        <p className="text-sm md:text-base mt-2" style={{ color: colors.muted }}>Cerita singkat dari pengguna yang membangun di Nimbus</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {items.map((t) => (
          <Card key={t.name} style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <div className="flex flex-col gap-3">
              <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
                “{t.quote}”
              </p>
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'color-mix(in oklab, var(--border) 70%, transparent)' }}>
                <div className="pt-2">
                  <div className="text-sm font-semibold" style={{ color: colors.text }}>{t.name}</div>
                  <div className="text-xs" style={{ color: colors.muted }}>{t.role}</div>
                </div>
                <Button variant="outline" className="mt-2">Thanks Nimbus</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
