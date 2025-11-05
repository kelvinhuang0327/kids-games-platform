import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'

interface Fruit {
  id: number
  emoji: string
  x: number
  y: number
  isSliced: boolean
}

const FRUIT_EMOJIS = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🥝', '🍑', '🍒', '🍍', '🥭', '🥥', '🍐', '🫐', '🍈']

// 水果切切樂：訓練反應速度
export const FruitSlicePage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  const gameDuration = ageGroup === '4-6' ? 30 : 60 // 秒
  const [fruits, setFruits] = useState<Fruit[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(gameDuration)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())
  const [slicedCount, setSlicedCount] = useState(0)

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false)
          setIsComplete(true)

          saveResult({
            gameId: 'fruit-slice',
            completed: true,
            score,
            duration: Date.now() - startTime,
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, timeLeft, score, startTime, saveResult])

  useEffect(() => {
    if (!isPlaying) return

    const spawnInterval = setInterval(() => {
      spawnFruit()
    }, ageGroup === '4-6' ? 1500 : 1000)

    return () => clearInterval(spawnInterval)
  }, [isPlaying, ageGroup])

  const spawnFruit = () => {
    const newFruit: Fruit = {
      id: Date.now() + Math.random(),
      emoji: FRUIT_EMOJIS[Math.floor(Math.random() * FRUIT_EMOJIS.length)],
      x: Math.random() * 80 + 10, // 10-90%
      y: -10,
      isSliced: false,
    }

    setFruits((prev) => [...prev, newFruit])

    // 3秒後移除水果
    setTimeout(() => {
      setFruits((prev) => prev.filter((f) => f.id !== newFruit.id))
    }, 3000)
  }

  const handleFruitClick = (fruitId: number) => {
    setFruits((prev) =>
      prev.map((f) => (f.id === fruitId ? { ...f, isSliced: true } : f))
    )
    setScore((prev) => prev + 10)
    setSlicedCount((prev) => prev + 1)

    setTimeout(() => {
      setFruits((prev) => prev.filter((f) => f.id !== fruitId))
    }, 500)
  }

  const startGame = () => {
    setIsPlaying(true)
    setScore(0)
    setTimeLeft(gameDuration)
    setFruits([])
    setSlicedCount(0)
    setIsComplete(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🍎 水果切切樂
            </h1>
            <p className="text-gray-600">
              點擊水果得分，訓練反應速度！
            </p>
          </div>
          <Button variant="default" onClick={() => navigate(-1)}>
            ← 返回
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-6">
              <div className="text-xl">
                <span className="font-bold">時間:</span> {timeLeft}秒
              </div>
              <div className="text-xl">
                <span className="font-bold">分數:</span> {score}
              </div>
              <div className="text-xl">
                <span className="font-bold">切到:</span> {slicedCount}
              </div>
            </div>
            {!isPlaying && !isComplete && (
              <Button variant="kids" size="lg" onClick={startGame}>
                🎮 開始遊戲
              </Button>
            )}
          </div>

          {/* 遊戲區域 */}
          <div className="relative bg-gradient-to-b from-sky-100 to-green-100 rounded-xl overflow-hidden" style={{ height: '500px' }}>
            {!isPlaying && !isComplete && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-9xl mb-4">🍎</div>
                  <p className="text-2xl font-bold text-gray-700">
                    點擊「開始遊戲」開始切水果！
                  </p>
                  <p className="text-lg text-gray-600 mt-2">
                    在 {gameDuration} 秒內盡可能切更多水果
                  </p>
                </div>
              </div>
            )}

            {isPlaying && (
              <AnimatePresence>
                {fruits.map((fruit) => (
                  <motion.button
                    key={fruit.id}
                    initial={{ y: -50, opacity: 1 }}
                    animate={{
                      y: fruit.isSliced ? 0 : 550,
                      opacity: fruit.isSliced ? 0 : 1,
                      scale: fruit.isSliced ? 2 : 1,
                      rotate: fruit.isSliced ? 360 : 0,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: fruit.isSliced ? 0.5 : 3, ease: 'linear' }}
                    onClick={() => handleFruitClick(fruit.id)}
                    className="absolute text-6xl cursor-pointer hover:scale-110 transition-transform"
                    style={{ left: `${fruit.x}%`, top: 0 }}
                    disabled={fruit.isSliced}
                  >
                    {fruit.emoji}
                  </motion.button>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* 完成畫面 */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold mb-2">遊戲結束！</h2>
            <p className="text-xl mb-4">你的表現很棒！</p>
            <div className="space-y-2 mb-6">
              <p>切到水果: <span className="font-bold">{slicedCount} 個</span></p>
              <p className="text-2xl">總分: <span className="font-bold">{score}</span></p>
              <p className="text-lg">
                {score >= 300 ? '🌟 超級大師！' : score >= 200 ? '⭐ 很厲害！' : score >= 100 ? '👍 不錯！' : '💪 繼續加油！'}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="default" size="lg" onClick={startGame}>
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
