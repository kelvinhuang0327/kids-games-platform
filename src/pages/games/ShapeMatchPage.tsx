import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'

interface Shape {
  id: string
  name: string
  emoji: string
  color: string
}

const SHAPES: Shape[] = [
  { id: 'circle', name: '圓形', emoji: '⭕', color: 'bg-red-400' },
  { id: 'square', name: '正方形', emoji: '🟦', color: 'bg-blue-400' },
  { id: 'triangle', name: '三角形', emoji: '🔺', color: 'bg-yellow-400' },
  { id: 'star', name: '星形', emoji: '⭐', color: 'bg-purple-400' },
  { id: 'heart', name: '愛心', emoji: '❤️', color: 'bg-pink-400' },
  { id: 'diamond', name: '菱形', emoji: '🔶', color: 'bg-orange-400' },
  { id: 'hexagon', name: '六邊形', emoji: '⬡', color: 'bg-teal-400' },
  { id: 'pentagon', name: '五邊形', emoji: '⬟', color: 'bg-indigo-400' },
  { id: 'octagon', name: '八邊形', emoji: '🛑', color: 'bg-rose-400' },
  { id: 'oval', name: '橢圓形', emoji: '🥚', color: 'bg-lime-400' },
  { id: 'crescent', name: '月牙形', emoji: '🌙', color: 'bg-cyan-400' },
  { id: 'lightning', name: '閃電形', emoji: '⚡', color: 'bg-amber-400' },
  { id: 'cloud', name: '雲朵形', emoji: '☁️', color: 'bg-sky-400' },
  { id: 'flower', name: '花朵形', emoji: '🌸', color: 'bg-fuchsia-400' },
]

// 形狀拼拼樂：學習形狀辨識與配對
export const ShapeMatchPage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  const shapeCount = ageGroup === '4-6' ? 4 : 6
  const [availableShapes, setAvailableShapes] = useState<Shape[]>([])
  const [targetShape, setTargetShape] = useState<Shape | null>(null)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [maxRounds] = useState(10)
  const [feedback, setFeedback] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    nextRound()
  }, [])

  const nextRound = () => {
    if (round > maxRounds) {
      // 遊戲完成
      setIsComplete(true)
      const duration = Date.now() - startTime

      saveResult({
        gameId: 'shape-match',
        completed: true,
        score,
        duration,
      })
      return
    }

    // 選擇可用的形狀
    const shapes = SHAPES.slice(0, shapeCount)
    setAvailableShapes(shapes)

    // 隨機選擇目標形狀
    const target = shapes[Math.floor(Math.random() * shapes.length)]
    setTargetShape(target)
    setFeedback('')
  }

  const handleShapeClick = (shape: Shape) => {
    if (!targetShape || isComplete) return

    if (shape.id === targetShape.id) {
      // 正確
      setScore(score + 100)
      setCorrectCount(correctCount + 1)
      setFeedback('✅ 正確！太棒了！')
      setTimeout(() => {
        setRound(round + 1)
        nextRound()
      }, 1000)
    } else {
      // 錯誤
      setFeedback(`❌ 再試試看！要找的是${targetShape.name}`)
    }
  }

  const restartGame = () => {
    setScore(0)
    setRound(1)
    setCorrectCount(0)
    setIsComplete(false)
    setFeedback('')
    nextRound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🔷 形狀拼拼樂
            </h1>
            <p className="text-gray-600">
              找出正確的形狀，學習形狀辨識！
            </p>
          </div>
          <Button variant="default" onClick={() => navigate(-1)}>
            ← 返回
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
          <div className="flex justify-between mb-6">
            <div className="flex gap-6">
              <div>
                <span className="font-bold">回合:</span> {round}/{maxRounds}
              </div>
              <div>
                <span className="font-bold">分數:</span> {score}
              </div>
              <div>
                <span className="font-bold">正確:</span> {correctCount}
              </div>
            </div>
            <Button variant="default" size="sm" onClick={restartGame}>
              🔄 重新開始
            </Button>
          </div>

          {!isComplete && targetShape && (
            <>
              {/* 目標形狀 */}
              <Card hoverScale={false} className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="text-center">
                  <p className="text-2xl font-bold mb-4">請找出這個形狀：</p>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-9xl mb-4"
                  >
                    {targetShape.emoji}
                  </motion.div>
                  <p className="text-3xl font-bold text-purple-600">{targetShape.name}</p>
                </div>
              </Card>

              {/* 反饋訊息 */}
              <AnimatePresence mode="wait">
                {feedback && (
                  <motion.div
                    key={feedback}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`text-center text-2xl font-bold mb-6 p-4 rounded-xl ${
                      feedback.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {feedback}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 形狀選項 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {availableShapes.map((shape, index) => (
                  <motion.div
                    key={shape.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      onClick={() => handleShapeClick(shape)}
                      className="cursor-pointer hover:shadow-2xl transition-shadow"
                    >
                      <div className="text-center p-6">
                        <div className={ageGroup === '4-6' ? 'text-9xl mb-4' : 'text-8xl mb-4'}>
                          {shape.emoji}
                        </div>
                        {ageGroup === '7-13' && (
                          <p className="text-xl font-bold text-gray-700">{shape.name}</p>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 完成畫面 */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">形狀大師！</h2>
            <p className="text-xl mb-4">你成功完成了所有回合！</p>
            <div className="space-y-2 mb-6">
              <p>完成回合: <span className="font-bold">{maxRounds}</span></p>
              <p>正確數: <span className="font-bold">{correctCount}/{maxRounds}</span></p>
              <p>正確率: <span className="font-bold">{Math.round((correctCount / maxRounds) * 100)}%</span></p>
              <p className="text-2xl">總分: <span className="font-bold">{score}</span></p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="default" size="lg" onClick={restartGame}>
                再玩一次
              </Button>
              <Button variant="default" size="lg" onClick={() => navigate(-1)}>
                返回遊戲大廳
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
