import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { playSuccessMessage, playFailureMessage } from '@/utils/audioFeedback'

interface Weather {
  id: string
  name: string
  emoji: string
  description: string
  temperature: string
}

interface ClothingItem {
  id: string
  name: string
  emoji: string
  suitableWeather: string[]
}

const WEATHERS: Weather[] = [
  { id: 'sunny', name: '晴天', emoji: '☀️', description: '陽光普照，天氣很熱', temperature: '28°C' },
  { id: 'rainy', name: '雨天', emoji: '🌧️', description: '下著大雨，記得帶傘', temperature: '18°C' },
  { id: 'winter', name: '冬天', emoji: '❄️', description: '天氣很冷，要保暖', temperature: '5°C' },
  { id: 'hot', name: '炎熱', emoji: '🔥', description: '非常炎熱的夏天', temperature: '35°C' },
]

const CLOTHING_ITEMS: ClothingItem[] = [
  { id: 'tshirt', name: '短袖上衣', emoji: '👕', suitableWeather: ['sunny', 'hot'] },
  { id: 'shorts', name: '短褲', emoji: '🩳', suitableWeather: ['sunny', 'hot'] },
  { id: 'hat', name: '帽子', emoji: '🧢', suitableWeather: ['sunny', 'hot'] },
  { id: 'sunglasses', name: '太陽眼鏡', emoji: '🕶️', suitableWeather: ['sunny', 'hot'] },
  { id: 'raincoat', name: '雨衣', emoji: '🧥', suitableWeather: ['rainy'] },
  { id: 'umbrella', name: '雨傘', emoji: '☂️', suitableWeather: ['rainy'] },
  { id: 'boots', name: '雨靴', emoji: '🥾', suitableWeather: ['rainy', 'winter'] },
  { id: 'jacket', name: '外套', emoji: '🧥', suitableWeather: ['winter'] },
  { id: 'sweater', name: '毛衣', emoji: '🧶', suitableWeather: ['winter'] },
  { id: 'scarf', name: '圍巾', emoji: '🧣', suitableWeather: ['winter'] },
  { id: 'gloves', name: '手套', emoji: '🧤', suitableWeather: ['winter'] },
  { id: 'swimsuit', name: '泳衣', emoji: '🩱', suitableWeather: ['hot'] },
]

// 天氣換裝趣：學習根據天氣選擇合適的衣物
export const WeatherDressUpPage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [maxRounds] = useState(10)
  const [feedback, setFeedback] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [startTime] = useState(Date.now())
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    startNewRound()
  }, [])

  const startNewRound = () => {
    if (round > maxRounds) {
      completeGame()
      return
    }

    // 隨機選擇天氣
    const weather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)]
    setCurrentWeather(weather)
    setSelectedItems([])
    setFeedback('')
    setShowResult(false)
  }

  const toggleItem = (itemId: string) => {
    if (showResult) return

    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  const checkAnswer = () => {
    if (!currentWeather || selectedItems.length === 0) {
      setFeedback('❌ 請至少選擇一件衣物！')
      return
    }

    // 檢查每件選擇的衣物是否適合當前天氣
    const allCorrect = selectedItems.every((itemId) => {
      const item = CLOTHING_ITEMS.find((i) => i.id === itemId)
      return item && item.suitableWeather.includes(currentWeather.id)
    })

    // 檢查是否至少選擇了一件適合的衣物
    const hasCorrectItem = selectedItems.some((itemId) => {
      const item = CLOTHING_ITEMS.find((i) => i.id === itemId)
      return item && item.suitableWeather.includes(currentWeather.id)
    })

    if (allCorrect && hasCorrectItem) {
      const points = 100
      setScore(score + points)
      setCorrectCount(correctCount + 1)
      setFeedback('✅ 太棒了！你選的衣服很適合這個天氣！')
      playSuccessMessage()
    } else if (hasCorrectItem) {
      const points = 50
      setScore(score + points)
      setFeedback('⚠️ 還不錯！但有些衣服不太適合這個天氣哦！')
      playFailureMessage()
    } else {
      setFeedback('❌ 再想想看！這些衣服不適合這個天氣！')
      playFailureMessage()
    }

    setShowResult(true)

    setTimeout(() => {
      setRound(round + 1)
      startNewRound()
    }, 2500)
  }

  const completeGame = () => {
    setIsComplete(true)
    const duration = Date.now() - startTime

    saveResult({
      gameId: 'weather-dress-up',
      completed: true,
      score,
      duration,
    })
  }

  const restartGame = () => {
    setScore(0)
    setRound(1)
    setCorrectCount(0)
    setIsComplete(false)
    setFeedback('')
    startNewRound()
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-2xl"
        >
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold mb-4">天氣小專家！</h2>
          <p className="text-2xl mb-6">你完成了所有天氣挑戰！</p>
          <div className="bg-gradient-to-r from-sky-200 to-blue-200 rounded-2xl p-6 mb-8">
            <p className="text-xl mb-2">完成回合: <span className="font-bold">{maxRounds}</span></p>
            <p className="text-xl mb-2">正確數: <span className="font-bold">{correctCount}/{maxRounds}</span></p>
            <p className="text-xl mb-2">正確率: <span className="font-bold">{Math.round((correctCount / maxRounds) * 100)}%</span></p>
            <p className="text-3xl mt-4">總分: <span className="font-bold text-blue-600">{score}</span> 分</p>
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🌤️ 天氣換裝趣
            </h1>
            <p className="text-gray-600">
              根據天氣選擇合適的衣服！
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

          {currentWeather && (
            <>
              {/* 天氣顯示 */}
              <Card hoverScale={false} className="mb-8 bg-gradient-to-r from-sky-50 to-blue-50">
                <div className="text-center">
                  <p className="text-2xl font-bold mb-4">今天的天氣：</p>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-9xl mb-4"
                  >
                    {currentWeather.emoji}
                  </motion.div>
                  <p className="text-3xl font-bold text-blue-600 mb-2">{currentWeather.name}</p>
                  <p className="text-xl text-gray-600 mb-2">{currentWeather.description}</p>
                  <p className="text-2xl font-bold text-orange-500">{currentWeather.temperature}</p>
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
                      feedback.includes('✅')
                        ? 'bg-green-100 text-green-700'
                        : feedback.includes('⚠️')
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {feedback}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 衣物選擇 */}
              <div className="mb-6">
                <p className="text-xl font-bold mb-4 text-center">選擇適合的衣物：</p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {CLOTHING_ITEMS.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        onClick={() => toggleItem(item.id)}
                        className={`cursor-pointer transition-all ${
                          selectedItems.includes(item.id)
                            ? 'ring-4 ring-blue-500 bg-blue-50'
                            : 'hover:shadow-xl'
                        }`}
                      >
                        <div className="text-center p-4">
                          <div className={ageGroup === '4-6' ? 'text-7xl mb-2' : 'text-5xl mb-2'}>
                            {item.emoji}
                          </div>
                          {ageGroup === '7-13' && (
                            <p className="text-sm font-bold text-gray-700">{item.name}</p>
                          )}
                          {selectedItems.includes(item.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-2xl mt-2"
                            >
                              ✓
                            </motion.div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 確認按鈕 */}
              {!showResult && (
                <div className="text-center">
                  <Button
                    variant="default"
                    size="lg"
                    onClick={checkAnswer}
                    disabled={selectedItems.length === 0}
                  >
                    確認選擇 ({selectedItems.length} 件)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
