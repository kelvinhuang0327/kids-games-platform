import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { GAMES, AGE_GROUPS } from '@/utils/constants'
import { useGameStore } from '@/store/useGameStore'
import type { AgeGroup } from '@/types'

export const GameHall = () => {
  const navigate = useNavigate()
  const { ageGroup } = useParams<{ ageGroup: AgeGroup }>()
  const { progress } = useGameStore()

  if (!ageGroup || (ageGroup !== '4-6' && ageGroup !== '7-13')) {
    return <div>無效的年齡組</div>
  }

  const availableGames = Object.values(GAMES).filter((game) =>
    game.ageGroups.includes(ageGroup)
  )

  const ageGroupInfo = AGE_GROUPS[ageGroup]

  return (
    <div className="min-h-screen p-8" style={{ background: ageGroupInfo.bg }}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: ageGroupInfo.color }}>
              {ageGroupInfo.name} 🎮
            </h1>
            <p className="text-gray-600">選擇一個遊戲開始玩吧！</p>
          </div>
          <Button variant="default" onClick={() => navigate('/')}>
            ← 返回首頁
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableGames.map((game, index) => {
            const gameProgress = progress[game.id]
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card onClick={() => navigate(`/game/${game.id}`)}>
                  <div className="text-center">
                    <div className="text-6xl mb-4">{game.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{game.displayName}</h3>
                    <p className="text-gray-600 mb-4">{game.description}</p>

                    {gameProgress && (
                      <div className="bg-gray-100 rounded-lg p-3 text-sm">
                        <div className="flex justify-between mb-1">
                          <span>完成次數:</span>
                          <span className="font-bold">{gameProgress.attempts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>最佳分數:</span>
                          <span className="font-bold">{gameProgress.bestScore}</span>
                        </div>
                      </div>
                    )}

                    <Button
                      variant={ageGroup === '4-6' ? 'toddler' : 'kids'}
                      size="md"
                      className="w-full mt-4"
                      onClick={(e) => {
                        e?.stopPropagation()
                        navigate(`/game/${game.id}`)
                      }}
                    >
                      開始遊戲
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
