import { Link } from 'react-router-dom'
import { colors } from './Theme'

export default function Footer(){
  return (
    <footer className="mt-16 border-t" style={{ borderColor: colors.border, backgroundColor: 'color-mix(in oklab, var(--bg) 88%, transparent)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-block w-6 h-6 rounded-full" style={{ backgroundColor: 'var(--bubblegum)', boxShadow:'0 4px 12px rgba(244,114,182,0.35)' }} />
            Nimbus
          </div>
          <p className="mt-2" style={{ color: colors.muted }}>Playful cloud for domains, VPS and panels — pastel-powered.</p>
        </div>
        <div>
          <div className="font-medium mb-2" style={{ color: colors.text }}>Product</div>
          <ul className="space-y-1">
            <li><Link to="/order" style={{ color: colors.muted }}>Pricing</Link></li>
            <li><Link to="/dashboard" style={{ color: colors.muted }}>Dashboard</Link></li>
            <li><Link to="/tos" style={{ color: colors.muted }}>Terms</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-2" style={{ color: colors.text }}>Resources</div>
          <ul className="space-y-1">
            <li><a href="#features" style={{ color: colors.muted }}>Features</a></li>
            <li><a href="#products" style={{ color: colors.muted }}>Products</a></li>
            <li><a href="#support" style={{ color: colors.muted }}>Support</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-2" style={{ color: colors.text }}>Follow</div>
          <ul className="space-y-1">
            <li><a href="#" style={{ color: colors.muted }}>Twitter</a></li>
            <li><a href="#" style={{ color: colors.muted }}>GitHub</a></li>
            <li><a href="#" style={{ color: colors.muted }}>Discord</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4" style={{ borderColor: colors.border }}>
        <div className="max-w-7xl mx-auto px-4 text-xs" style={{ color: colors.muted }}>
          © {new Date().getFullYear()} Nimbus. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
