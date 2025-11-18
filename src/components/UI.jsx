import { forwardRef } from 'react'
import { colors } from './Theme'

export function cn(...classes){
  return classes.filter(Boolean).join(' ')
}

export const Button = ({variant='primary', className='', children, ...props}) => {
  const variantMap = {
    primary: `bg-[${colors.primary}] text-white hover:shadow-lg`,
    secondary: `bg-[${colors.secondary}] text-[#1a1a1a] hover:shadow-lg`,
    tertiary: `bg-[${colors.tertiary}] text-[#0f172a] hover:shadow-lg`,
    destructive: `bg-[${colors.magenta}] text-white hover:shadow-lg`,
    ghost: `bg-white/70 text-[#0f172a] hover:bg-white`,
  }
  return (
    <button
      {...props}
      className={cn(
        'rounded-[12px] px-4 py-2 transition-transform duration-200 ease-out hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400 shadow-sm',
        variantMap[variant],
        className
      )}
    >
      {children}
    </button>
  )
}

export const Card = ({className='', children}) => (
  <div className={cn('rounded-[12px] bg-white shadow-sm hover:shadow-md transition-all duration-300 p-4', className)}>
    {children}
  </div>
)

export const Input = forwardRef(function Input({className='', ...props}, ref){
  return (
    <input ref={ref} {...props} className={cn('w-full rounded-[12px] border border-[#e9d7f7] focus:border-pink-300 focus:ring-2 focus:ring-pink-200 outline-none bg-white px-3 py-2 text-sm placeholder:text-slate-400', className)} />
  )
})

export const Select = ({className='', children, ...props}) => (
  <select {...props} className={cn('w-full rounded-[12px] border border-[#e9d7f7] focus:border-pink-300 focus:ring-2 focus:ring-pink-200 outline-none bg-white px-3 py-2 text-sm', className)}>
    {children}
  </select>
)

export const Textarea = ({className='', ...props}) => (
  <textarea {...props} className={cn('w-full rounded-[12px] border border-[#e9d7f7] focus:border-pink-300 focus:ring-2 focus:ring-pink-200 outline-none bg-white px-3 py-2 text-sm', className)} />
)

export const Badge = ({color='pink', children}) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    color==='pink' && 'bg-pink-200 text-pink-900',
    color==='mint' && 'bg-emerald-200 text-emerald-900',
    color==='blue' && 'bg-sky-200 text-sky-900',
    color==='yellow' && 'bg-yellow-200 text-yellow-900',
  )}>{children}</span>
)
