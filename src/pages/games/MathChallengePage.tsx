import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { playSuccessMessage, playFailureMessage } from '@/utils/audioFeedback'

interface Question {
  num1: number
  num2: number
  operator: '+' | '-' | '×' | '÷'
  answer: number
}

// 數學挑戰：適合 7-13 歲
export const MathChallengePage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  const maxQuestions = 15
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    // 只允許 7-13 歲
    if (ageGroup === '4-6') {
      alert('這個遊戲只適合 7-13 歲的小朋友哦！')
      navigate(-1)
      return
    }
    generateQuestion()
  }, [ageGroup, navigate])

  const generateQuestion = () => {
    const operators: Array<'+' | '-' | '×' | '÷'> = ['+', '-', '×', '÷']
    const operator = operators[Math.floor(Math.random() * operators.length)]

    let num1, num2, answer

    switch (operator) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1
        num2 = Math.floor(Math.random() * 50) + 1
        answer = num1 + num2
        break
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20
        num2 = Math.floor(Math.random() * num1)
        answer = num1 - num2
        break
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        answer = num1 * num2
        break
      case '÷':
        num2 = Math.floor(Math.random() * 10) + 2
        answer = Math.floor(Math.random() * 10) + 1
        num1 = num2 * answer
        break
    }

    setCurrentQuestion({ num1, num2, operator, answer })
    setUserAnswer('')
    setFeedback('')
  }

  const handleSubmit = () => {
    if (!currentQuestion || userAnswer === '') return

    const isCorrect = parseInt(userAnswer) === currentQuestion.answer

    if (isCorrect) {
      setScore(score + 10)
      setCorrectCount(correctCount + 1)
      setFeedback('✅ 正確！')
      playSuccessMessage()
    } else {
      setFeedback(`❌ 答案是 ${currentQuestion.answer}`)
      playFailureMessage()
    }

    setTimeout(() => {
      if (questionNumber >= maxQuestions) {
        setIsComplete(true)
        const duration = Date.now() - startTime

        saveResult({
          gameId: 'math-challenge',
          completed: true,
          score,
          duration,
        })
      } else {
        setQuestionNumber(questionNumber + 1)
        generateQuestion()
      }
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const restartGame = () => {
    setQuestionNumber(1)
    setScore(0)
    setCorrectCount(0)
    setIsComplete(false)
    generateQuestion()
  }

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              ➕ 數學挑戰
            </h1>
            <p className="text-gray-600">
              鍛鍊你的數學運算能力！
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
                  <span className="font-bold">題目:</span> {questionNumber}/{maxQuestions}
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
                key={questionNumber}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card hoverScale={false} className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="text-center py-8">
                    <div className="text-7xl font-bold text-indigo-600 mb-6">
                      {currentQuestion.num1} {currentQuestion.operator} {currentQuestion.num2} = ?
                    </div>
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-48 px-6 py-4 text-4xl text-center border-4 border-indigo-300 rounded-xl focus:border-indigo-500 focus:outline-none font-bold"
                      placeholder="?"
                      autoFocus
                      disabled={feedback !== ''}
                    />
                  </div>
                </Card>

                {feedback === '' ? (
                  <div className="text-center">
                    <Button
                      variant="kids"
                      size="lg"
                      onClick={handleSubmit}
                      disabled={userAnswer === ''}
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
            className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">數學大師！</h2>
            <p className="text-xl mb-4">你完成了數學挑戰！</p>
            <div className="space-y-2 mb-6">
              <p>完成題數: <span className="font-bold">{maxQuestions}</span></p>
              <p>正確數: <span className="font-bold">{correctCount}/{maxQuestions}</span></p>
              <p>正確率: <span className="font-bold">{Math.round((correctCount / maxQuestions) * 100)}%</span></p>
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
