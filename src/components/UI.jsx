import { forwardRef } from 'react'
import { colors, radii } from './Theme'

export function cn(...classes){
  return classes.filter(Boolean).join(' ')
}

export const Button = ({variant='primary', className='', children, style={}, disabled=false, ...props}) => {
  const base = {
    padding: '0.5rem 1rem',
    borderRadius: radii.base,
    transition: 'background-color 120ms ease, box-shadow 120ms ease, transform 80ms ease, opacity 120ms ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    boxShadow: 'var(--shadow-1)'
  }

  const variantMap = {
    primary: {
      class: 'text-white',
      style: { backgroundColor: colors.primary }
    },
    secondary: {
      class: '',
      style: { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderStyle: 'solid' }
    },
    ghost: {
      class: '',
      style: { color: colors.text, backgroundColor: 'transparent' }
    },
    outline: {
      class: '',
      style: { color: colors.text, backgroundColor: 'transparent', border: `1px solid ${colors.border}` }
    },
    destructive: {
      class: 'text-white',
      style: { backgroundColor: '#EF4444' }
    },
    candy: {
      class: 'text-white',
      style: { backgroundColor: colors.bubblegum }
    }
  }

  const v = variantMap[variant] || variantMap.primary

  const hoverStyle = disabled ? {} : (
    variant === 'secondary' ? { backgroundColor: 'color-mix(in oklab, var(--surface) 92%, var(--primary) 8%)' } :
    variant === 'ghost' ? { backgroundColor: 'rgba(167,139,250,0.10)' } :
    variant === 'outline' ? { backgroundColor: 'rgba(167,139,250,0.06)' } :
    variant === 'destructive' ? { filter: 'brightness(0.95)' } :
    variant === 'candy' ? { filter: 'brightness(1.05)' } :
    { filter: 'brightness(1.05)' }
  )

  const activeStyle = disabled ? {} : { transform: 'translateY(0.5px)', boxShadow: 'var(--shadow-1)' }

  // Visible keyboard focus ring for accessibility
  const focusStyle = disabled ? {} : { boxShadow: '0 0 0 2px rgba(167,139,250,0.55), var(--shadow-1)' }

  return (
    <button
      {...props}
      disabled={disabled}
      style={{ ...base, ...v.style, ...style }}
      className={cn(
        // keep native outline for high-contrast agents; we also show a custom ring via JS
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa] focus:outline-none',
        className
      )}
      onMouseEnter={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...v.style, ...style, ...hoverStyle }) }}
      onMouseLeave={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...v.style, ...style, boxShadow: 'var(--shadow-1)', transform: 'translateY(0px)' }) }}
      onMouseDown={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...v.style, ...style, ...activeStyle }) }}
      onMouseUp={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...v.style, ...style, ...hoverStyle }) }}
      onFocus={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...v.style, ...style, ...focusStyle }) }}
      onBlur={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...v.style, ...style, boxShadow: 'var(--shadow-1)' }) }}
    >
      {children}
    </button>
  )
}

export const Card = ({className='', children, style={}}) => (
  <div
    style={{ backgroundColor: colors.surface, borderColor: colors.border, ...style, borderWidth: 1, borderStyle:'solid', borderRadius: radii.base, boxShadow: 'var(--shadow-2)' }}
    className={cn('p-4', className)}
  >
    {children}
  </div>
)

export const Input = forwardRef(function Input({className='', style={}, ...props}, ref){
  const base = { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, borderWidth: 1, borderStyle:'solid', borderRadius: radii.base, padding: '0.5rem 0.75rem', fontSize: '0.875rem', transition: 'border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease' }
  const hover = { backgroundColor: 'color-mix(in oklab, var(--surface) 94%, var(--primary) 6%)' }
  const focus = { boxShadow: '0 0 0 2px rgba(167,139,250,0.55)' }
  return (
    <input
      ref={ref}
      {...props}
      style={{ ...base, ...style }}
      className={cn('w-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]', className)}
      onMouseEnter={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...style, ...hover }) }}
      onMouseLeave={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...style }) }}
      onFocus={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...style, ...focus }) }}
      onBlur={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...style }) }}
    />
  )}
)

export const Select = ({className='', children, style={}, ...props}) => {
  const base = { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, borderWidth: 1, borderStyle:'solid', borderRadius: radii.base, padding: '0.5rem 0.75rem', fontSize: '0.875rem', transition: 'border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease' }
  const hover = { backgroundColor: 'color-mix(in oklab, var(--surface) 94%, var(--primary) 6%)' }
  const focus = { boxShadow: '0 0 0 2px rgba(167,139,250,0.55)' }
  return (
    <select
      {...props}
      style={{ ...base, ...style }}
      className={cn('w-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]', className)}
      onMouseEnter={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...style, ...hover }) }}
      onMouseLeave={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...style }) }}
      onFocus={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...style, ...focus }) }}
      onBlur={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...style }) }}
    >
      {children}
    </select>
  )
}

export const Textarea = ({className='', style={}, ...props}) => {
  const base = { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, borderWidth: 1, borderStyle:'solid', borderRadius: radii.base, padding: '0.5rem 0.75rem', fontSize: '0.875rem', transition: 'border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease' }
  const hover = { backgroundColor: 'color-mix(in oklab, var(--surface) 94%, var(--primary) 6%)' }
  const focus = { boxShadow: '0 0 0 2px rgba(167,139,250,0.55)' }
  return (
    <textarea
      {...props}
      style={{ ...base, ...style }}
      className={cn('w-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]', className)}
      onMouseEnter={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...style, ...hover }) }}
      onMouseLeave={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...style }) }}
      onFocus={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...style, ...focus }) }}
      onBlur={(e)=>{ Object.assign(e.currentTarget.style, { ...base, ...style }) }}
    />
  )
}

export const Badge = ({color='muted', children}) => {
  // Soft pastel badges that adapt to theme tokens
  const styles = {
    muted: {
      bg: 'rgba(244,114,182,0.15)', // bubblegum wash
      text: colors.text,
      border: 'rgba(244,114,182,0.3)'
    },
    blue: {
      bg: 'rgba(96,165,250,0.15)',
      text: colors.text,
      border: 'rgba(96,165,250,0.35)'
    },
    green: {
      bg: 'rgba(52,211,153,0.18)',
      text: colors.text,
      border: 'rgba(52,211,153,0.35)'
    },
    yellow: {
      bg: 'rgba(251,191,36,0.18)',
      text: colors.text,
      border: 'rgba(251,191,36,0.35)'
    },
  }
  const s = styles[color] || styles.muted
  return (
    <span style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border, borderWidth:1, borderStyle:'solid', borderRadius: 999 }} className={cn('inline-flex items-center px-2.5 py-0.5 text-xs font-medium')}>
      {children}
    </span>
  )
}
