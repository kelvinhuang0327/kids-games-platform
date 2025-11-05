import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'

interface Animal {
  id: string
  name: string
  emoji: string
  habitat: string
  fact: string
}

interface Habitat {
  id: string
  name: string
  emoji: string
  description: string
}

const HABITATS: Habitat[] = [
  { id: 'forest', name: '森林', emoji: '🌲', description: '樹木茂密的地方' },
  { id: 'ocean', name: '海洋', emoji: '🌊', description: '廣闊的大海' },
  { id: 'savanna', name: '草原', emoji: '🌾', description: '一望無際的草地' },
  { id: 'arctic', name: '北極', emoji: '🧊', description: '冰天雪地的寒冷地方' },
  { id: 'desert', name: '沙漠', emoji: '🏜️', description: '炎熱乾燥的地方' },
  { id: 'rainforest', name: '雨林', emoji: '🌴', description: '潮濕多雨的熱帶森林' },
]

const ANIMALS: Animal[] = [
  { id: 'bear', name: '棕熊', emoji: '🐻', habitat: 'forest', fact: '棕熊喜歡吃魚和蜂蜜' },
  { id: 'fox', name: '狐狸', emoji: '🦊', habitat: 'forest', fact: '狐狸很聰明，會藏食物' },
  { id: 'owl', name: '貓頭鷹', emoji: '🦉', habitat: 'forest', fact: '貓頭鷹在夜晚活動' },
  { id: 'dolphin', name: '海豚', emoji: '🐬', habitat: 'ocean', fact: '海豚很聰明，會跳躍' },
  { id: 'whale', name: '鯨魚', emoji: '🐋', habitat: 'ocean', fact: '鯨魚是海洋中最大的動物' },
  { id: 'fish', name: '魚', emoji: '🐟', habitat: 'ocean', fact: '魚用鰓在水中呼吸' },
  { id: 'lion', name: '獅子', emoji: '🦁', habitat: 'savanna', fact: '獅子是草原之王' },
  { id: 'elephant', name: '大象', emoji: '🐘', habitat: 'savanna', fact: '大象有長長的鼻子' },
  { id: 'giraffe', name: '長頸鹿', emoji: '🦒', habitat: 'savanna', fact: '長頸鹿有長長的脖子' },
  { id: 'zebra', name: '斑馬', emoji: '🦓', habitat: 'savanna', fact: '每隻斑馬的條紋都不一樣' },
  { id: 'polar-bear', name: '北極熊', emoji: '🐻‍❄️', habitat: 'arctic', fact: '北極熊有厚厚的毛皮保暖' },
  { id: 'penguin', name: '企鵝', emoji: '🐧', habitat: 'arctic', fact: '企鵝不會飛但很會游泳' },
  { id: 'seal', name: '海豹', emoji: '🦭', habitat: 'arctic', fact: '海豹在冰上休息' },
  { id: 'camel', name: '駱駝', emoji: '🐪', habitat: 'desert', fact: '駱駝可以很久不喝水' },
  { id: 'snake', name: '蛇', emoji: '🐍', habitat: 'desert', fact: '蛇用身體感受溫度' },
  { id: 'parrot', name: '鸚鵡', emoji: '🦜', habitat: 'rainforest', fact: '鸚鵡會模仿人說話' },
  { id: 'monkey', name: '猴子', emoji: '🐒', habitat: 'rainforest', fact: '猴子喜歡在樹上跳來跳去' },
  { id: 'tiger', name: '老虎', emoji: '🐯', habitat: 'rainforest', fact: '老虎是叢林的霸主' },
]

// 動物園探險家：學習動物與棲息地配對
export const ZooExplorerPage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  const maxRounds = ageGroup === '4-6' ? 8 : 12
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null)
  const [habitatOptions, setHabitatOptions] = useState<Habitat[]>([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [feedback, setFeedback] = useState('')
  const [showFact, setShowFact] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    startNewRound()
  }, [])

  const startNewRound = () => {
    if (round > maxRounds) {
      completeGame()
      return
    }

    // 隨機選擇動物
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
    setCurrentAnimal(animal)

    // 找到正確的棲息地
    const correctHabitat = HABITATS.find((h) => h.id === animal.habitat)!

    // 隨機選擇其他棲息地作為選項
    const wrongHabitats = HABITATS.filter((h) => h.id !== animal.habitat)
      .sort(() => Math.random() - 0.5)
      .slice(0, ageGroup === '4-6' ? 2 : 3)

    // 合併並打亂選項
    const options = [correctHabitat, ...wrongHabitats].sort(() => Math.random() - 0.5)
    setHabitatOptions(options)

    setFeedback('')
    setShowFact(false)
  }

  const handleHabitatClick = (habitatId: string) => {
    if (!currentAnimal || showFact) return

    if (habitatId === currentAnimal.habitat) {
      const points = 100
      setScore(score + points)
      setCorrectCount(correctCount + 1)
      setFeedback('✅ 正確！太棒了！')
      setShowFact(true)

      setTimeout(() => {
        setRound(round + 1)
        startNewRound()
      }, 3000)
    } else {
      setFeedback('❌ 再想想看！這不是正確的家哦！')
      setTimeout(() => {
        setFeedback('')
      }, 1500)
    }
  }

  const completeGame = () => {
    setIsComplete(true)
    const duration = Date.now() - startTime

    saveResult({
      gameId: 'zoo-explorer',
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
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-100 p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-2xl"
        >
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold mb-4">動物園專家！</h2>
          <p className="text-2xl mb-6">你完成了所有動物配對！</p>
          <div className="bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl p-6 mb-8">
            <p className="text-xl mb-2">完成回合: <span className="font-bold">{maxRounds}</span></p>
            <p className="text-xl mb-2">正確數: <span className="font-bold">{correctCount}/{maxRounds}</span></p>
            <p className="text-xl mb-2">正確率: <span className="font-bold">{Math.round((correctCount / maxRounds) * 100)}%</span></p>
            <p className="text-3xl mt-4">總分: <span className="font-bold text-green-600">{score}</span> 分</p>
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
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🦁 動物園探險家
            </h1>
            <p className="text-gray-600">
              幫動物找到牠們的家！
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

          {currentAnimal && (
            <>
              {/* 動物顯示 */}
              <Card hoverScale={false} className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="text-center">
                  <p className="text-2xl font-bold mb-4">幫這個動物找到牠的家：</p>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-9xl mb-4"
                  >
                    {currentAnimal.emoji}
                  </motion.div>
                  <p className="text-3xl font-bold text-green-600">{currentAnimal.name}</p>
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

              {/* 動物小知識 */}
              {showFact && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-yellow-100 border-4 border-yellow-300 rounded-2xl p-6 mb-6 text-center"
                >
                  <p className="text-xl font-bold mb-2">💡 動物小知識</p>
                  <p className="text-lg text-gray-700">{currentAnimal.fact}</p>
                </motion.div>
              )}

              {/* 棲息地選項 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {habitatOptions.map((habitat, index) => (
                  <motion.div
                    key={habitat.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      onClick={() => handleHabitatClick(habitat.id)}
                      className={`cursor-pointer hover:shadow-2xl transition-shadow ${
                        showFact && habitat.id === currentAnimal.habitat ? 'ring-4 ring-green-500' : ''
                      }`}
                    >
                      <div className="text-center p-6">
                        <div className={ageGroup === '4-6' ? 'text-9xl mb-4' : 'text-8xl mb-4'}>
                          {habitat.emoji}
                        </div>
                        {ageGroup === '7-13' && (
                          <>
                            <p className="text-2xl font-bold text-gray-800 mb-2">{habitat.name}</p>
                            <p className="text-sm text-gray-600">{habitat.description}</p>
                          </>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
