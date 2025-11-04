import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  hoverScale?: boolean
}

export const Card = ({
  children,
  onClick,
  className = '',
  hoverScale = true,
}: CardProps) => {
  return (
    <motion.div
      whileHover={hoverScale ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      className={`
        bg-white
        rounded-2xl
        shadow-lg
        p-6
        ${onClick ? 'cursor-pointer hover:shadow-xl' : ''}
        transition-shadow
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
