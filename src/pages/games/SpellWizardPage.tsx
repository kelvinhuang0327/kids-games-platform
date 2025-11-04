import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'

interface Word {
  word: string
  hint: string
  category: string
}

const WORDS: Word[] = [
  { word: 'CAT', hint: '喵喵叫的動物', category: '動物' },
  { word: 'DOG', hint: '汪汪叫的動物', category: '動物' },
  { word: 'FISH', hint: '在水裡游的動物', category: '動物' },
  { word: 'BIRD', hint: '會飛的動物', category: '動物' },
  { word: 'APPLE', hint: '紅色的水果', category: '水果' },
  { word: 'BANANA', hint: '黃色彎彎的水果', category: '水果' },
  { word: 'ORANGE', hint: '橙色的水果', category: '水果' },
  { word: 'BOOK', hint: '用來閱讀的東西', category: '物品' },
  { word: 'PEN', hint: '用來寫字的工具', category: '物品' },
  { word: 'BALL', hint: '圓圓的玩具', category: '玩具' },
  { word: 'SUN', hint: '白天照亮天空的', category: '自然' },
  { word: 'MOON', hint: '晚上出現在天空', category: '自然' },
  { word: 'STAR', hint: '晚上天空中閃閃發光', category: '自然' },
  { word: 'TREE', hint: '有樹葉和樹枝的植物', category: '植物' },
  { word: 'FLOWER', hint: '美麗又香的植物', category: '植物' },
]

// 拼字魔法師：適合 7-13 歲
export const SpellWizardPage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  const maxWords = 10
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    // 只允許 7-13 歲
    if (ageGroup === '4-6') {
      alert('這個遊戲只適合 7-13 歲的小朋友哦！')
      navigate(-1)
      return
    }

    // 隨機選擇單字
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5)
    setWords(shuffled.slice(0, maxWords))
  }, [ageGroup, navigate])

  const currentWord = words[currentIndex]

  const handleSubmit = () => {
    if (!currentWord || userInput === '') return

    const isCorrect = userInput.toUpperCase() === currentWord.word

    if (isCorrect) {
      const points = showHint ? 5 : 10
      setScore(score + points)
      setCorrectCount(correctCount + 1)
      setFeedback('✅ 正確！')
    } else {
      setFeedback(`❌ 正確答案是: ${currentWord.word}`)
    }

    setTimeout(() => {
      if (currentIndex + 1 >= words.length) {
        setIsComplete(true)
        const duration = Date.now() - startTime

        saveResult({
          gameId: 'spell-wizard',
          completed: true,
          score,
          duration,
        })
      } else {
        setCurrentIndex(currentIndex + 1)
        setUserInput('')
        setFeedback('')
        setShowHint(false)
      }
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const restartGame = () => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5)
    setWords(shuffled.slice(0, maxWords))
    setCurrentIndex(0)
    setScore(0)
    setCorrectCount(0)
    setUserInput('')
    setFeedback('')
    setShowHint(false)
    setIsComplete(false)
  }

  if (words.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🔤 拼字魔法師
            </h1>
            <p className="text-gray-600">
              練習英文單字拼寫，成為拼字高手！
            </p>
          </div>
          <Button variant="default" onClick={() => navigate(-1)}>
            ← 返回
          </Button>
        </div>

        {!isComplete ? (
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex justify-between mb-6">
              <div className="flex gap-6">
                <div>
                  <span className="font-bold">單字:</span> {currentIndex + 1}/{words.length}
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

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card hoverScale={false} className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="text-center py-8">
                    <div className="inline-block bg-purple-200 px-4 py-2 rounded-full mb-4">
                      <span className="text-lg font-bold text-purple-700">{currentWord.category}</span>
                    </div>
                    <div className="text-4xl font-bold text-purple-600 mb-6">
                      {currentWord.hint}
                    </div>

                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-yellow-100 p-4 rounded-xl mb-4"
                      >
                        <p className="text-xl">
                          💡 提示: {currentWord.word.length} 個字母
                        </p>
                        <p className="text-3xl font-mono mt-2">
                          {currentWord.word.split('').map(() => '_ ').join('')}
                        </p>
                      </motion.div>
                    )}

                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                      onKeyPress={handleKeyPress}
                      className="w-64 px-6 py-4 text-3xl text-center border-4 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none font-bold uppercase"
                      placeholder="輸入英文"
                      autoFocus
                      disabled={feedback !== ''}
                    />
                  </div>
                </Card>

                {feedback === '' ? (
                  <div className="flex gap-4 justify-center">
                    {!showHint && (
                      <Button
                        variant="default"
                        size="md"
                        onClick={() => setShowHint(true)}
                      >
                        💡 看提示（-5分）
                      </Button>
                    )}
                    <Button
                      variant="kids"
                      size="lg"
                      onClick={handleSubmit}
                      disabled={userInput === ''}
                    >
                      ✓ 確認答案
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card
                      hoverScale={false}
                      className={`text-center ${
                        feedback.includes('✅')
                          ? 'bg-green-100 border-2 border-green-400'
                          : 'bg-red-100 border-2 border-red-400'
                      }`}
                    >
                      <div className="text-3xl font-bold py-4">{feedback}</div>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">拼字大師！</h2>
            <p className="text-xl mb-4">你完成了拼字挑戰！</p>
            <div className="space-y-2 mb-6">
              <p>完成單字: <span className="font-bold">{words.length}</span></p>
              <p>正確數: <span className="font-bold">{correctCount}/{words.length}</span></p>
              <p>正確率: <span className="font-bold">{Math.round((correctCount / words.length) * 100)}%</span></p>
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
