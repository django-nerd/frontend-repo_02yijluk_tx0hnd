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
      class: `text-[${colors.text}] border hover:bg-[${colors.bg}]`,
      style: { backgroundColor: colors.surface, borderColor: colors.border }
    },
    ghost: {
      class: `text-[${colors.text}] hover:bg-[${colors.bg}]`,
      style: { backgroundColor: 'transparent' }
    },
    outline: {
      class: `text-[${colors.text}] hover:bg-[${colors.bg}]`,
      style: { backgroundColor: 'transparent', border: `1px solid ${colors.border}` }
    },
    destructive: {
      class: `text-white hover:opacity-90`,
      style: { backgroundColor: '#EF4444' }
    },
    // Candy now uses a static pastel color (no gradient)
    candy: {
      class: `text-white shadow-sm hover:shadow-md`,
      style: { backgroundColor: colors.primary }
    }
  }
  const v = variantMap[variant] || variantMap.primary
  return (
    <button
      {...props}
      style={{ ...v.style, ...style }}
      className={cn(
        `rounded-[${radii.base}] px-4 py-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[${colors.primary}] focus-visible:ring-offset-2`,
        v.class,
        className
      )}
    >
      {children}
    </button>
  )
}

export const Card = ({className='', children, style={}}) => (
  <div style={style} className={cn(`rounded-[${radii.base}] bg-[${colors.surface}] border border-[${colors.border}] shadow-[0_1px_0_rgba(17,24,39,0.04),0_8px_24px_rgba(167,139,250,0.08)] p-4`, className)}>
    {children}
  </div>
)

export const Input = forwardRef(function Input({className='', style={}, ...props}, ref){
  return (
    <input ref={ref} {...props} style={{ backgroundColor: colors.surface, borderColor: colors.border, ...style }} className={cn(`w-full rounded-[${radii.base}] border focus:ring-2 focus:ring-[${colors.primary}]/20 focus:border-[${colors.primary}] outline-none px-3 py-2 text-sm placeholder:text-slate-400`, className)} />
  )}
)

export const Select = ({className='', children, style={}, ...props}) => (
  <select {...props} style={{ backgroundColor: colors.surface, borderColor: colors.border, ...style }} className={cn(`w-full rounded-[${radii.base}] border focus:ring-2 focus:ring-[${colors.primary}]/20 focus:border-[${colors.primary}] outline-none px-3 py-2 text-sm`, className)}>
    {children}
  </select>
)

export const Textarea = ({className='', style={}, ...props}) => (
  <textarea {...props} style={{ backgroundColor: colors.surface, borderColor: colors.border, ...style }} className={cn(`w-full rounded-[${radii.base}] border focus:ring-2 focus:ring-[${colors.primary}]/20 focus:border-[${colors.primary}] outline-none px-3 py-2 text-sm`, className)} />
)

export const Badge = ({color='muted', children}) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    color==='muted' && 'bg-pink-50 text-pink-700 border border-pink-100',
    color==='blue' && 'bg-sky-100 text-sky-800 border border-sky-200',
    color==='green' && 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    color==='yellow' && 'bg-amber-100 text-amber-800 border border-amber-200',
  )}>{children}</span>
)
