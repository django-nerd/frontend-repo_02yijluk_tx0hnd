import { forwardRef } from 'react'
import { colors, radii } from './Theme'

export function cn(...classes){
  return classes.filter(Boolean).join(' ')
}

export const Button = ({variant='primary', className='', children, style={}, ...props}) => {
  const variantMap = {
    primary: {
      class: `text-white shadow-sm hover:shadow-md`,
      style: { backgroundColor: colors.primary }
    },
    secondary: {
      class: `transition-colors`,
      style: { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }
    },
    ghost: {
      class: `transition-colors`,
      style: { color: colors.text, backgroundColor: 'transparent' }
    },
    outline: {
      class: `transition-colors`,
      style: { color: colors.text, backgroundColor: 'transparent', border: `1px solid ${colors.border}` }
    },
    destructive: {
      class: `text-white hover:opacity-90`,
      style: { backgroundColor: '#EF4444' }
    },
    // Candy uses a static bubblegum pastel color across the app
    candy: {
      class: `text-white shadow-sm hover:shadow-md`,
      style: { backgroundColor: colors.bubblegum }
    }
  }
  const v = variantMap[variant] || variantMap.primary
  return (
    <button
      {...props}
      style={{ ...v.style, ...style, borderRadius: radii.base }}
      className={cn(
        `px-4 py-2 focus:outline-none focus-visible:ring-2`,
        className
      )}
    >
      {children}
    </button>
  )
}

export const Card = ({className='', children, style={}}) => (
  <div style={{ backgroundColor: colors.surface, borderColor: colors.border, ...style, borderWidth: 1, borderStyle:'solid', borderRadius: radii.base }} className={cn(`shadow-[0_1px_0_rgba(17,24,39,0.04),0_8px_24px_rgba(167,139,250,0.08)] p-4`, className)}>
    {children}
  </div>
)

export const Input = forwardRef(function Input({className='', style={}, ...props}, ref){
  return (
    <input ref={ref} {...props} style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, ...style, borderWidth: 1, borderStyle:'solid', borderRadius: radii.base }} className={cn(`w-full outline-none px-3 py-2 text-sm placeholder:text-slate-400`, className)} />
  )}
)

export const Select = ({className='', children, style={}, ...props}) => (
  <select {...props} style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, ...style, borderWidth: 1, borderStyle:'solid', borderRadius: radii.base }} className={cn(`w-full outline-none px-3 py-2 text-sm`, className)}>
    {children}
  </select>
)

export const Textarea = ({className='', style={}, ...props}) => (
  <textarea {...props} style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, ...style, borderWidth: 1, borderStyle:'solid', borderRadius: radii.base }} className={cn(`w-full outline-none px-3 py-2 text-sm`, className)} />
)

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
