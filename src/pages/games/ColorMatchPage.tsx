import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { playSuccessMessage, playFailureMessage } from '@/utils/audioFeedback'

interface ColorItem {
  id: number
  color: string
  name: string
  emoji: string
}

const COLORS: ColorItem[] = [
  { id: 1, color: '#FF6B6B', name: '紅色', emoji: '🍎' },
  { id: 2, color: '#4ECDC4', name: '青色', emoji: '💧' },
  { id: 3, color: '#FFE66D', name: '黃色', emoji: '🌟' },
  { id: 4, color: '#95E1D3', name: '綠色', emoji: '🌿' },
  { id: 5, color: '#A8E6CF', name: '淺綠', emoji: '🍀' },
  { id: 6, color: '#FFB6C1', name: '粉紅', emoji: '🌸' },
  { id: 7, color: '#DDA0DD', name: '紫色', emoji: '🍇' },
  { id: 8, color: '#FFD700', name: '金色', emoji: '⭐' },
  { id: 9, color: '#FF8C00', name: '橙色', emoji: '🍊' },
  { id: 10, color: '#87CEEB', name: '天藍', emoji: '☁️' },
  { id: 11, color: '#8B4513', name: '棕色', emoji: '🐻' },
  { id: 12, color: '#C0C0C0', name: '銀色', emoji: '🌙' },
  { id: 13, color: '#FF1493', name: '桃紅', emoji: '🌺' },
  { id: 14, color: '#00CED1', name: '深青', emoji: '🐟' },
  { id: 15, color: '#9370DB', name: '中紫', emoji: '🦄' },
  { id: 16, color: '#32CD32', name: '萊姆綠', emoji: '🥒' },
  { id: 17, color: '#FF4500', name: '橘紅', emoji: '🦊' },
  { id: 18, color: '#BA55D3', name: '蘭花紫', emoji: '🌷' },
]

export const ColorMatchPage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  // 4-6歲：4個顏色，7-13歲：6個顏色
  const colorCount = ageGroup === '4-6' ? 4 : 6

  const [targetColor, setTargetColor] = useState<ColorItem | null>(null)
  const [options, setOptions] = useState<ColorItem[]>([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [totalRounds] = useState(10)
  const [startTime] = useState(Date.now())
  const [isComplete, setIsComplete] = useState(false)
  const [feedback, setFeedback] = useState<string>('')

  useEffect(() => {
    nextRound()
  }, [])

  const nextRound = () => {
    if (round >= totalRounds) {
      completeGame()
      return
    }

    // 隨機選擇目標顏色
    const selectedColors = COLORS.slice(0, colorCount)
    const target = selectedColors[Math.floor(Math.random() * selectedColors.length)]

    // 打亂選項
    const shuffled = [...selectedColors].sort(() => Math.random() - 0.5)

    setTargetColor(target)
    setOptions(shuffled)
    setFeedback('')
    setRound(round + 1)
  }

  const handleColorClick = (selected: ColorItem) => {
    if (!targetColor) return

    if (selected.id === targetColor.id) {
      setScore(score + 100)
      setFeedback('✅ 正確！')
      playSuccessMessage() // 播放成功語音
      setTimeout(() => {
        nextRound()
      }, 1000)
    } else {
      setFeedback('❌ 再試試看！')
      playFailureMessage() // 播放失敗語音
      setTimeout(() => {
        setFeedback('')
      }, 1000)
    }
  }

  const completeGame = () => {
    setIsComplete(true)
    const duration = Date.now() - startTime

    saveResult({
      gameId: 'color-match',
      completed: true,
      score,
      duration,
    })
  }

  const resetGame = () => {
    setScore(0)
    setRound(0)
    setIsComplete(false)
    setFeedback('')
    nextRound()
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-2xl"
        >
          <div className="text-8xl mb-6">🎨</div>
          <h2 className="text-4xl font-bold mb-4">太棒了！</h2>
          <p className="text-2xl mb-6">你完成了顏色配對遊戲！</p>
          <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-6 mb-8">
            <p className="text-3xl font-bold">
              總分: <span className="text-purple-600">{score}</span> 分
            </p>
            <p className="text-xl mt-2">
              正確率: <span className="font-bold">{Math.round((score / (totalRounds * 100)) * 100)}%</span>
            </p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🎨 顏色配對樂園
            </h1>
            <p className="text-gray-600">
              點擊正確的顏色！
            </p>
          </div>
          <Button variant="default" onClick={() => navigate(-1)}>
            ← 返回
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
          <div className="flex justify-between mb-8">
            <div className="text-lg">
              <span className="font-bold">回合:</span> {round} / {totalRounds}
            </div>
            <div className="text-lg">
              <span className="font-bold">分數:</span> {score}
            </div>
          </div>

          {targetColor && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <p className="text-2xl font-bold mb-6">找出這個顏色：</p>
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-48 h-48 rounded-3xl shadow-2xl flex items-center justify-center text-6xl"
                  style={{ backgroundColor: targetColor.color }}
                >
                  {targetColor.emoji}
                </motion.div>
                <p className="text-3xl font-bold">{targetColor.name}</p>
              </div>
            </motion.div>
          )}

          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-center text-3xl font-bold mb-6 ${
                feedback.includes('✅') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {feedback}
            </motion.div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {options.map((color, index) => (
              <motion.div
                key={color.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleColorClick(color)}
                className="cursor-pointer rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
                style={{
                  backgroundColor: color.color,
                  aspectRatio: '1/1'
                }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  <div className={ageGroup === '4-6' ? 'text-7xl mb-2' : 'text-5xl mb-2'}>
                    {color.emoji}
                  </div>
                  {ageGroup === '7-13' && (
                    <p className="text-xl font-bold drop-shadow-lg">{color.name}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
