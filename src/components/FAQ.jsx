import { useState } from 'react'
import { colors } from './Theme'
import { Card } from './UI'

const QA = [
  {
    q: 'Apakah bisa ganti region setelah beli?',
    a: 'Bisa. Migrasi region dapat dilakukan dari panel dengan downtime minimal, tergantung ukuran disk.',
  },
  {
    q: 'Ada jaminan uptime?',
    a: 'Ya, SLA 99.9% untuk semua paket. Paket Pro/Max memiliki SLA 99.99% dengan kredit jika terjadi pelanggaran.',
  },
  {
    q: 'Metode pembayaran apa saja?',
    a: 'Kartu kredit/debit, virtual account, e-wallet populer, dan PayPal untuk pelanggan internasional.',
  },
  {
    q: 'Bisa trial dulu?',
    a: 'Ada sandbox terbatas untuk uji panel. Untuk VPS, kami sediakan garansi uang kembali 7 hari.',
  },
]

function Item({ i, open, onToggle, q, a }){
  return (
    <div className="border-b py-3" style={{ borderColor: 'color-mix(in oklab, var(--border) 70%, transparent)' }}>
      <button
        onClick={() => onToggle(i)}
        className="w-full text-left flex items-center justify-between"
        aria-expanded={open}
        style={{ color: colors.text }}
      >
        <span className="text-sm md:text-base font-medium">{q}</span>
        <span className={`ml-4 inline-block transition-transform ${open ? 'rotate-45' : ''}`}>＋</span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="text-sm mt-2" style={{ color: colors.muted }}>{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ(){
  const [open, setOpen] = useState(-1)
  const toggle = (i) => setOpen(prev => prev === i ? -1 : i)

  return (
    <section aria-label="FAQ" className="relative mt-20 md:mt-28 max-w-3xl mx-auto px-4">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-semibold" style={{ color: colors.text }}>Pertanyaan umum</h3>
        <p className="text-sm md:text-base mt-2" style={{ color: colors.muted }}>Hal-hal yang sering ditanyakan sebelum mulai</p>
      </div>
      <Card style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
        {QA.map((row, i) => (
          <Item key={row.q} i={i} open={open === i} onToggle={toggle} q={row.q} a={row.a} />
        ))}
      </Card>
    </section>
  )
}
