import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { playSuccessMessage, playFailureMessage } from '@/utils/audioFeedback'

interface Bubble {
  id: number
  color: string
  colorName: string
  x: number
  y: number
  size: number
  speed: number
  isPopped: boolean
}

const COLORS = [
  { color: '#FF6B6B', name: '紅色' },
  { color: '#4ECDC4', name: '青色' },
  { color: '#FFE66D', name: '黃色' },
  { color: '#95E1D3', name: '綠色' },
  { color: '#FFB6C1', name: '粉紅' },
  { color: '#DDA0DD', name: '紫色' },
  { color: '#FFD700', name: '金色' },
  { color: '#FF8C00', name: '橙色' },
]

// 魔法泡泡樂園：戳破指定顏色的泡泡
export const MagicBubblePage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  const gameDuration = ageGroup === '4-6' ? 30 : 60 // 秒
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [targetColor, setTargetColor] = useState<{ color: string; name: string } | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(gameDuration)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())
  const [correctPops, setCorrectPops] = useState(0)
  const [wrongPops, setWrongPops] = useState(0)
  const nextBubbleId = useRef(0)

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false)
          setIsComplete(true)

          saveResult({
            gameId: 'magic-bubble',
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
  }, [isPlaying, timeLeft, score, startTime])

  useEffect(() => {
    if (!isPlaying) return

    const spawnInterval = setInterval(() => {
      spawnBubble()
    }, ageGroup === '4-6' ? 1500 : 1000)

    return () => clearInterval(spawnInterval)
  }, [isPlaying, ageGroup])

  useEffect(() => {
    if (!isPlaying) return

    const moveInterval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            y: bubble.y - bubble.speed,
          }))
          .filter((bubble) => bubble.y > -100 && !bubble.isPopped)
      )
    }, 50)

    return () => clearInterval(moveInterval)
  }, [isPlaying])

  const startGame = () => {
    setIsPlaying(true)
    setScore(0)
    setCorrectPops(0)
    setWrongPops(0)
    setTimeLeft(gameDuration)
    setBubbles([])
    selectNewTargetColor()
  }

  const selectNewTargetColor = () => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    setTargetColor(randomColor)
  }

  const spawnBubble = () => {
    const colorData = COLORS[Math.floor(Math.random() * COLORS.length)]
    const newBubble: Bubble = {
      id: nextBubbleId.current++,
      color: colorData.color,
      colorName: colorData.name,
      x: Math.random() * 80 + 5, // 5% to 85%
      y: 100,
      size: Math.random() * 30 + 50, // 50-80px
      speed: Math.random() * 1 + 1.5, // 1.5-2.5
      isPopped: false,
    }

    setBubbles((prev) => [...prev, newBubble])
  }

  const handleBubbleClick = (bubble: Bubble) => {
    if (!isPlaying || bubble.isPopped || !targetColor) return

    // 標記泡泡為已戳破
    setBubbles((prev) =>
      prev.map((b) => (b.id === bubble.id ? { ...b, isPopped: true } : b))
    )

    if (bubble.color === targetColor.color) {
      // 正確的顏色
      const points = 10
      setScore(score + points)
      setCorrectPops(correctPops + 1)
      playSuccessMessage()

      // 每戳破5個正確的泡泡，換一個目標顏色
      if ((correctPops + 1) % 5 === 0) {
        selectNewTargetColor()
      }
    } else {
      // 錯誤的顏色
      const penalty = 5
      setScore(Math.max(0, score - penalty))
      setWrongPops(wrongPops + 1)
      playFailureMessage()
    }
  }

  const resetGame = () => {
    setIsPlaying(false)
    setIsComplete(false)
    setScore(0)
    setCorrectPops(0)
    setWrongPops(0)
    setTimeLeft(gameDuration)
    setBubbles([])
    setTargetColor(null)
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-2xl"
        >
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold mb-4">泡泡大師！</h2>
          <p className="text-2xl mb-6">你完成了泡泡挑戰！</p>
          <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl p-6 mb-8">
            <p className="text-xl mb-2">正確戳破: <span className="font-bold text-green-600">{correctPops}</span> 個</p>
            <p className="text-xl mb-2">錯誤戳破: <span className="font-bold text-red-600">{wrongPops}</span> 個</p>
            <p className="text-xl mb-2">
              準確率: <span className="font-bold">
                {correctPops + wrongPops > 0
                  ? Math.round((correctPops / (correctPops + wrongPops)) * 100)
                  : 0}%
              </span>
            </p>
            <p className="text-3xl mt-4">總分: <span className="font-bold text-purple-600">{score}</span> 分</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="default" size="lg" onClick={resetGame}>
              再玩一次
            </Button>
            <Button variant="default" size="lg" onClick={() => navigate(-1)}>
              返回遊戲大廳
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!isPlaying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-2xl"
        >
          <div className="text-8xl mb-6">🫧</div>
          <h1 className="text-5xl font-bold mb-4 text-gray-800">魔法泡泡樂園</h1>
          <p className="text-xl mb-8 text-gray-600">
            戳破指定顏色的泡泡，訓練你的反應力和色彩辨識能力！
          </p>
          <div className="bg-purple-50 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">遊戲規則：</h2>
            <ul className="text-left text-lg space-y-2 max-w-md mx-auto">
              <li>• 只戳破指定顏色的泡泡</li>
              <li>• 戳對得 10 分</li>
              <li>• 戳錯扣 5 分</li>
              <li>• 遊戲時間：{gameDuration} 秒</li>
              <li>• 每5個正確泡泡會換新顏色</li>
            </ul>
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="default" size="lg" onClick={startGame}>
              開始遊戲
            </Button>
            <Button variant="default" size="lg" onClick={() => navigate(-1)}>
              返回
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4 overflow-hidden">
      {/* 遊戲資訊面板 */}
      <div className="max-w-6xl mx-auto mb-4">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex gap-6 items-center">
              <div className="text-xl">
                <span className="font-bold">時間:</span>{' '}
                <span className={`font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-800'}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="text-xl">
                <span className="font-bold">分數:</span>{' '}
                <span className="font-bold text-purple-600">{score}</span>
              </div>
              <div className="text-xl">
                <span className="font-bold">正確:</span>{' '}
                <span className="font-bold text-green-600">{correctPops}</span>
              </div>
            </div>
            <Button variant="default" size="sm" onClick={() => navigate(-1)}>
              ← 離開
            </Button>
          </div>
        </div>
      </div>

      {/* 目標顏色提示 */}
      {targetColor && (
        <motion.div
          key={targetColor.color}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-6xl mx-auto mb-4"
        >
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl text-center">
            <p className="text-2xl font-bold mb-3">請戳破這個顏色的泡泡：</p>
            <div className="flex items-center justify-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-20 h-20 rounded-full shadow-lg"
                style={{ backgroundColor: targetColor.color }}
              />
              <p className="text-3xl font-bold" style={{ color: targetColor.color }}>
                {targetColor.name}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 遊戲區域 */}
      <div className="relative h-[600px] max-w-6xl mx-auto bg-gradient-to-b from-sky-200/50 to-purple-200/50 rounded-3xl border-4 border-white/50 overflow-hidden">
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              initial={{ scale: 0 }}
              animate={{
                scale: bubble.isPopped ? 0 : 1,
                x: `${bubble.x}%`,
                y: bubble.y + '%',
              }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleBubbleClick(bubble)}
              className="absolute cursor-pointer"
              style={{
                width: bubble.size,
                height: bubble.size,
              }}
            >
              <div
                className="w-full h-full rounded-full shadow-lg hover:scale-110 transition-transform"
                style={{
                  backgroundColor: bubble.color,
                  opacity: 0.8,
                  boxShadow: `0 0 20px ${bubble.color}`,
                }}
              />
              {bubble.isPopped && (
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center text-4xl"
                >
                  {bubble.color === targetColor?.color ? '✨' : '💥'}
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 漂浮裝飾泡泡 */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`deco-${i}`}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + i,
                delay: i * 0.5,
              }}
              className="absolute w-8 h-8 rounded-full bg-white/30"
              style={{
                left: `${10 + i * 20}%`,
                top: `${20 + i * 10}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
