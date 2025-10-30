import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export const Card = ({ children, onClick, className = '' }: CardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`bg-white rounded-3xl shadow-lg p-6 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
