import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  variant?: 'default' | 'toddler' | 'kids'
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
  const variantClasses = {
    toddler: 'bg-toddler-primary hover:bg-pink-600 text-white',
    kids: 'bg-kids-primary hover:bg-blue-600 text-white',
    default: 'bg-gray-800 hover:bg-gray-700 text-white',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        font-bold
        shadow-lg
        transition-colors
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
