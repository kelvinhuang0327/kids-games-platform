import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'toddler' | 'kids' | 'default'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

export const Button = ({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
}: ButtonProps) => {
  const baseClasses = 'font-bold rounded-2xl transition-all focus:outline-none focus:ring-4'

  const variantClasses = {
    toddler: 'bg-toddler-primary hover:bg-pink-600 text-white focus:ring-pink-300',
    kids: 'bg-kids-primary hover:bg-blue-600 text-white focus:ring-blue-300',
    default: 'bg-gray-800 hover:bg-gray-700 text-white focus:ring-gray-400',
  }

  const sizeClasses = {
    sm: 'px-6 py-3 text-base',
    md: 'px-8 py-4 text-lg',
    lg: 'px-12 py-6 text-2xl',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
