import { forwardRef } from 'react'
import { colors, radii } from './Theme'

export function cn(...classes){
  return classes.filter(Boolean).join(' ')
}

export const Button = ({variant='primary', className='', children, ...props}) => {
  const variantMap = {
    primary: `bg-[${colors.primary}] text-white hover:bg-[${colors.primaryDark}]`,
    secondary: `bg-[${colors.surface}] text-[${colors.text}] border border-[${colors.border}] hover:bg-[${colors.bg}]`,
    ghost: `bg-transparent text-[${colors.text}] hover:bg-[${colors.bg}]`,
    outline: `bg-transparent text-[${colors.text}] border border-[${colors.border}] hover:bg-[${colors.bg}]`,
    destructive: `bg-red-500 text-white hover:bg-red-600`,
  }
  return (
    <button
      {...props}
      className={cn(
        `rounded-[${radii.base}] px-4 py-2 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 shadow-none`,
        variantMap[variant],
        className
      )}
    >
      {children}
    </button>
  )
}

export const Card = ({className='', children}) => (
  <div className={cn(`rounded-[${radii.base}] bg-[${colors.surface}] border border-[${colors.border}] shadow-none p-4`, className)}>
    {children}
  </div>
)

export const Input = forwardRef(function Input({className='', ...props}, ref){
  return (
    <input ref={ref} {...props} className={cn(`w-full rounded-[${radii.base}] border border-[${colors.border}] focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none bg-[${colors.surface}] px-3 py-2 text-sm placeholder:text-slate-400`, className)} />
  )}
)

export const Select = ({className='', children, ...props}) => (
  <select {...props} className={cn(`w-full rounded-[${radii.base}] border border-[${colors.border}] focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none bg-[${colors.surface}] px-3 py-2 text-sm`, className)}>
    {children}
  </select>
)

export const Textarea = ({className='', ...props}) => (
  <textarea {...props} className={cn(`w-full rounded-[${radii.base}] border border-[${colors.border}] focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none bg-[${colors.surface}] px-3 py-2 text-sm`, className)} />
)

export const Badge = ({color='muted', children}) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    color==='muted' && 'bg-slate-100 text-slate-700 border border-slate-200',
    color==='blue' && 'bg-sky-100 text-sky-800 border border-sky-200',
    color==='green' && 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    color==='yellow' && 'bg-amber-100 text-amber-800 border border-amber-200',
  )}>{children}</span>
)
