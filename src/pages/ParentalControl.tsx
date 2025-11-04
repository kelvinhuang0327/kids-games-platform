import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useGameStore } from '@/store/useGameStore'
import { storage } from '@/utils/storage'
import { GAMES } from '@/utils/constants'

export const ParentalControl = () => {
  const navigate = useNavigate()
  const { progress, clearAll } = useGameStore()
  const [verified, setVerified] = useState(false)
  const [answer, setAnswer] = useState('')

  const handleVerify = () => {
    if (answer === '8') {
      setVerified(true)
    } else {
      alert('答案錯誤！請再試一次。')
      setAnswer('')
    }
  }

  const handleClearData = () => {
    if (confirm('確定要清除所有遊戲資料嗎？此操作無法復原。')) {
      clearAll()
      storage.clear()
      alert('資料已清除！')
      navigate('/')
    }
  }

  if (!verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card>
            <div className="text-center">
              <div className="text-6xl mb-6">🔒</div>
              <h2 className="text-3xl font-bold mb-4">家長驗證</h2>
              <p className="text-gray-600 mb-6">
                請回答以下問題以進入家長控制台：
              </p>

              <div className="bg-blue-50 p-6 rounded-xl mb-6">
                <p className="text-2xl font-bold mb-4">3 + 5 = ?</p>
                <input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="輸入答案"
                  onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleVerify}
                  className="flex-1"
                >
                  確認
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  取消
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  const totalGames = Object.keys(progress).length
  const completedGames = Object.values(progress).filter(p => p.completed).length
  const totalAttempts = Object.values(progress).reduce((sum, p) => sum + p.attempts, 0)
  const totalScore = Object.values(progress).reduce((sum, p) => sum + p.bestScore, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                👨‍👩‍👧‍👦 家長控制台
              </h1>
              <p className="text-gray-600">查看孩子的遊戲統計與進度</p>
            </div>
            <Button variant="default" onClick={() => navigate('/')}>
              ← 返回首頁
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card hoverScale={false}>
              <div className="text-center">
                <div className="text-4xl mb-2">🎮</div>
                <p className="text-gray-600 text-sm mb-1">已玩遊戲</p>
                <p className="text-3xl font-bold">{totalGames}</p>
              </div>
            </Card>

            <Card hoverScale={false}>
              <div className="text-center">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-gray-600 text-sm mb-1">完成遊戲</p>
                <p className="text-3xl font-bold">{completedGames}</p>
              </div>
            </Card>

            <Card hoverScale={false}>
              <div className="text-center">
                <div className="text-4xl mb-2">🔄</div>
                <p className="text-gray-600 text-sm mb-1">總遊玩次數</p>
                <p className="text-3xl font-bold">{totalAttempts}</p>
              </div>
            </Card>

            <Card hoverScale={false}>
              <div className="text-center">
                <div className="text-4xl mb-2">⭐</div>
                <p className="text-gray-600 text-sm mb-1">總分數</p>
                <p className="text-3xl font-bold">{totalScore}</p>
              </div>
            </Card>
          </div>

          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-4">遊戲詳細統計</h2>
            <div className="space-y-4">
              {Object.entries(progress).map(([gameId, data]) => {
                const game = GAMES[gameId]
                if (!game) return null

                return (
                  <div key={gameId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{game.icon}</span>
                      <div>
                        <p className="font-bold">{game.displayName}</p>
                        <p className="text-sm text-gray-600">
                          最後遊玩: {new Date(data.lastPlayed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6 text-center">
                      <div>
                        <p className="text-sm text-gray-600">遊玩次數</p>
                        <p className="font-bold">{data.attempts}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">最佳分數</p>
                        <p className="font-bold">{data.bestScore}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">狀態</p>
                        <p className="font-bold">{data.completed ? '✅' : '⏳'}</p>
                      </div>
                    </div>
                  </div>
                )
              })}

              {totalGames === 0 && (
                <div className="text-center py-8 text-gray-500">
                  尚無遊戲記錄
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold mb-4 text-red-600">⚠️ 資料管理</h2>
            <p className="text-gray-600 mb-4">
              清除所有遊戲資料將會永久刪除孩子的遊戲進度與統計。
            </p>
            <Button
              variant="default"
              size="md"
              onClick={handleClearData}
              className="bg-red-600 hover:bg-red-700"
            >
              🗑️ 清除所有資料
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
