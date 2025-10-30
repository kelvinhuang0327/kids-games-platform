import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { GAMES, AGE_GROUPS } from '@/utils/constants'
import type { AgeGroup } from '@/types'

export const GameHall = () => {
  const navigate = useNavigate()
  const { ageGroup } = useParams<{ ageGroup: AgeGroup }>()

  if (!ageGroup || !['4-6', '7-13'].includes(ageGroup)) {
    navigate('/')
    return null
  }

  const availableGames = Object.values(GAMES).filter((game) =>
    game.ageGroups.includes(ageGroup)
  )

  const config = AGE_GROUPS[ageGroup]

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: config.bg }}
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold"
            style={{ color: config.color }}
          >
            {config.name}
          </motion.h1>
          <Button size="sm" onClick={() => navigate('/')}>
            ← 返回首頁
          </Button>
        </div>

        {/* Games Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {availableGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card onClick={() => navigate(`/game/${game.id}`)}>
                <div className="text-center">
                  <div className="text-6xl mb-4">{game.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{game.displayName}</h3>
                  <p className="text-gray-600 mb-4">{game.description}</p>
                  <Button
                    variant={ageGroup === '4-6' ? 'toddler' : 'kids'}
                    size="sm"
                  >
                    開始遊戲
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
