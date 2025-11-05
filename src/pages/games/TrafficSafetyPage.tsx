import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { playSuccessMessage, playFailureMessage } from '@/utils/audioFeedback'

interface Question {
  id: number
  situation: string
  emoji: string
  question: string
  options: { text: string; emoji: string; isCorrect: boolean; explanation: string }[]
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    situation: '紅綠燈',
    emoji: '🚦',
    question: '看到紅燈時，應該怎麼做？',
    options: [
      { text: '停下來等待', emoji: '🛑', isCorrect: true, explanation: '正確！紅燈停，這樣才安全！' },
      { text: '快速跑過去', emoji: '🏃', isCorrect: false, explanation: '不對哦！紅燈時要停下來等待。' },
      { text: '繼續慢慢走', emoji: '🚶', isCorrect: false, explanation: '不對哦！看到紅燈就要停下來。' },
    ],
  },
  {
    id: 2,
    situation: '過馬路',
    emoji: '🚸',
    question: '過馬路前，應該先做什麼？',
    options: [
      { text: '左看右看確認安全', emoji: '👀', isCorrect: true, explanation: '太棒了！過馬路要先左右看！' },
      { text: '直接衝過去', emoji: '🏃‍♂️', isCorrect: false, explanation: '危險！要先左右看確認安全。' },
      { text: '只看一邊', emoji: '👁️', isCorrect: false, explanation: '不夠安全！要左看右看兩邊都看。' },
    ],
  },
  {
    id: 3,
    situation: '人行道',
    emoji: '👣',
    question: '走在人行道上時，應該怎麼走？',
    options: [
      { text: '靠右邊走', emoji: '➡️', isCorrect: true, explanation: '正確！靠右邊走最安全！' },
      { text: '走在中間', emoji: '↔️', isCorrect: false, explanation: '不對哦！要靠右邊走才安全。' },
      { text: '隨便走', emoji: '↗️', isCorrect: false, explanation: '不對哦！要靠右邊走。' },
    ],
  },
  {
    id: 4,
    situation: '交通工具',
    emoji: '🚗',
    question: '坐車時，應該做什麼？',
    options: [
      { text: '繫好安全帶', emoji: '🔒', isCorrect: true, explanation: '很好！安全帶能保護我們！' },
      { text: '站著玩', emoji: '🤸', isCorrect: false, explanation: '危險！坐車要繫安全帶。' },
      { text: '把頭伸出窗外', emoji: '😵', isCorrect: false, explanation: '很危險！絕對不可以！' },
    ],
  },
  {
    id: 5,
    situation: '綠燈',
    emoji: '🟢',
    question: '看到綠燈時，可以怎麼做？',
    options: [
      { text: '確認安全後通過', emoji: '✅', isCorrect: true, explanation: '正確！綠燈也要小心確認！' },
      { text: '閉著眼睛跑', emoji: '😵‍💫', isCorrect: false, explanation: '危險！要張開眼睛看路。' },
      { text: '不用看就跑', emoji: '🏃', isCorrect: false, explanation: '不對！綠燈也要確認安全。' },
    ],
  },
  {
    id: 6,
    situation: '騎腳踏車',
    emoji: '🚲',
    question: '騎腳踏車時，應該戴什麼？',
    options: [
      { text: '戴安全帽', emoji: '⛑️', isCorrect: true, explanation: '太棒了！安全帽很重要！' },
      { text: '什麼都不戴', emoji: '🚫', isCorrect: false, explanation: '不對！要戴安全帽保護頭部。' },
      { text: '只戴帽子', emoji: '🧢', isCorrect: false, explanation: '不夠安全！要戴安全帽。' },
    ],
  },
  {
    id: 7,
    situation: '斑馬線',
    emoji: '🦓',
    question: '看到斑馬線時，應該怎麼做？',
    options: [
      { text: '走斑馬線過馬路', emoji: '🚶', isCorrect: true, explanation: '正確！斑馬線是安全通道！' },
      { text: '隨便找地方過', emoji: '❌', isCorrect: false, explanation: '危險！要走斑馬線。' },
      { text: '不過馬路', emoji: '🛑', isCorrect: false, explanation: '斑馬線就是讓我們安全過馬路的！' },
    ],
  },
  {
    id: 8,
    situation: '停車場',
    emoji: '🅿️',
    question: '在停車場時，應該注意什麼？',
    options: [
      { text: '小心來往車輛', emoji: '👀', isCorrect: true, explanation: '很好！停車場有很多車要小心！' },
      { text: '隨便亂跑', emoji: '🏃‍♀️', isCorrect: false, explanation: '危險！停車場有車要小心。' },
      { text: '不用注意', emoji: '😴', isCorrect: false, explanation: '不對！要隨時注意車輛。' },
    ],
  },
  {
    id: 9,
    situation: '公車',
    emoji: '🚌',
    question: '等公車時，應該站在哪裡？',
    options: [
      { text: '站在月台後方', emoji: '🚏', isCorrect: true, explanation: '正確！站在後方才安全！' },
      { text: '站在馬路上', emoji: '⚠️', isCorrect: false, explanation: '危險！要站在月台或人行道。' },
      { text: '站在車道邊緣', emoji: '😨', isCorrect: false, explanation: '太危險了！要站遠一點。' },
    ],
  },
  {
    id: 10,
    situation: '雨天',
    emoji: '☔',
    question: '下雨天過馬路時，要注意什麼？',
    options: [
      { text: '車子煞車距離變長', emoji: '🚗', isCorrect: true, explanation: '很聰明！雨天要更小心！' },
      { text: '跑得更快', emoji: '🏃', isCorrect: false, explanation: '不對！雨天地滑要更小心。' },
      { text: '不用特別注意', emoji: '🤷', isCorrect: false, explanation: '錯了！雨天要更加小心。' },
    ],
  },
  {
    id: 11,
    situation: '學校門口',
    emoji: '🏫',
    question: '在學校門口上下車時，應該從哪邊下車？',
    options: [
      { text: '靠人行道那邊', emoji: '🚶', isCorrect: true, explanation: '正確！這樣最安全！' },
      { text: '靠馬路那邊', emoji: '🚗', isCorrect: false, explanation: '危險！要從靠人行道的那邊。' },
      { text: '隨便哪邊都可以', emoji: '🤔', isCorrect: false, explanation: '不對！要從安全的那邊下車。' },
    ],
  },
  {
    id: 12,
    situation: '夜晚',
    emoji: '🌙',
    question: '晚上外出時，應該穿什麼顏色的衣服？',
    options: [
      { text: '淺色或反光衣服', emoji: '👕', isCorrect: true, explanation: '太棒了！這樣容易被看見！' },
      { text: '黑色衣服', emoji: '🖤', isCorrect: false, explanation: '不好！黑色在夜晚不容易被看見。' },
      { text: '顏色不重要', emoji: '🤷‍♂️', isCorrect: false, explanation: '很重要！要穿容易被看見的顏色。' },
    ],
  },
  {
    id: 13,
    situation: '電動滑板車',
    emoji: '🛴',
    question: '騎電動滑板車時，應該在哪裡騎？',
    options: [
      { text: '專用道或公園', emoji: '🌳', isCorrect: true, explanation: '正確！要在安全的地方騎！' },
      { text: '馬路上', emoji: '🚗', isCorrect: false, explanation: '危險！不可以在馬路上騎。' },
      { text: '人行道快速騎', emoji: '💨', isCorrect: false, explanation: '不對！會撞到行人。' },
    ],
  },
  {
    id: 14,
    situation: '救護車',
    emoji: '🚑',
    question: '聽到救護車的聲音時，應該怎麼做？',
    options: [
      { text: '讓路給救護車', emoji: '➡️', isCorrect: true, explanation: '很好！救護車在救人要讓路！' },
      { text: '繼續走自己的路', emoji: '🚶', isCorrect: false, explanation: '不對！要讓路給救護車。' },
      { text: '跟著救護車跑', emoji: '🏃', isCorrect: false, explanation: '危險！要靠邊讓路。' },
    ],
  },
  {
    id: 15,
    situation: '地下道',
    emoji: '🚇',
    question: '走地下道或天橋時，要注意什麼？',
    options: [
      { text: '不要奔跑推擠', emoji: '🚶‍♀️', isCorrect: true, explanation: '正確！慢慢走才安全！' },
      { text: '可以跑跳', emoji: '🤸‍♀️', isCorrect: false, explanation: '危險！容易跌倒或撞到人。' },
      { text: '不用扶扶手', emoji: '🙅', isCorrect: false, explanation: '不對！要扶好扶手。' },
    ],
  },
]

// 交通安全小勇士：學習交通安全知識
export const TrafficSafetyPage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  const maxQuestions = ageGroup === '4-6' ? 5 : 8
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    // 隨機選擇題目
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.slice(0, maxQuestions))
  }, [maxQuestions])

  const currentQuestion = questions[currentIndex]

  const handleOptionClick = (optionIndex: number) => {
    if (selectedOption !== null) return // 已經選過了

    setSelectedOption(optionIndex)
    setShowExplanation(true)

    const option = currentQuestion.options[optionIndex]
    if (option.isCorrect) {
      setScore(score + 100)
      setCorrectCount(correctCount + 1)
      playSuccessMessage()
    } else {
      playFailureMessage()
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
      setShowExplanation(false)
    } else {
      // 遊戲完成
      setIsComplete(true)
      const duration = Date.now() - startTime

      saveResult({
        gameId: 'traffic-safety',
        completed: true,
        score,
        duration,
      })
    }
  }

  const restartGame = () => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.slice(0, maxQuestions))
    setCurrentIndex(0)
    setScore(0)
    setCorrectCount(0)
    setSelectedOption(null)
    setShowExplanation(false)
    setIsComplete(false)
  }

  if (questions.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🚦 交通安全小勇士
            </h1>
            <p className="text-gray-600">
              學習交通安全知識，成為安全小達人！
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
                  <span className="font-bold">題目:</span> {currentIndex + 1}/{questions.length}
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

            {/* 題目卡片 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card hoverScale={false} className="mb-6 bg-gradient-to-r from-blue-50 to-green-50">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-600 mb-2">{currentQuestion.situation}</p>
                    <div className="text-9xl mb-6">{currentQuestion.emoji}</div>
                    <p className="text-2xl font-bold text-gray-800">{currentQuestion.question}</p>
                  </div>
                </Card>

                {/* 選項 */}
                <div className="space-y-4 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant={ageGroup === '4-6' ? 'toddler' : 'kids'}
                        size="lg"
                        onClick={() => handleOptionClick(index)}
                        disabled={selectedOption !== null}
                        className={`
                          w-full text-left justify-start text-lg py-6
                          ${selectedOption === index && option.isCorrect ? 'ring-4 ring-green-400' : ''}
                          ${selectedOption === index && !option.isCorrect ? 'ring-4 ring-red-400' : ''}
                          ${selectedOption !== null && selectedOption !== index ? 'opacity-50' : ''}
                        `}
                      >
                        {ageGroup === '4-6' ? (
                          <div className="flex items-center gap-3">
                            <span className="text-5xl">{option.emoji}</span>
                          </div>
                        ) : (
                          <>
                            <span className="mr-3 text-2xl">{String.fromCharCode(65 + index)}.</span>
                            <span className="mr-2 text-xl">{option.emoji}</span>
                            {option.text}
                          </>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* 解釋 */}
                <AnimatePresence>
                  {showExplanation && selectedOption !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Card
                        hoverScale={false}
                        className={`mb-6 ${
                          currentQuestion.options[selectedOption].isCorrect
                            ? 'bg-green-100 border-2 border-green-400'
                            : 'bg-red-100 border-2 border-red-400'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-6xl mb-3">
                            {currentQuestion.options[selectedOption].isCorrect ? '✅' : '❌'}
                          </div>
                          <p className="text-xl font-bold">
                            {currentQuestion.options[selectedOption].explanation}
                          </p>
                        </div>
                      </Card>

                      <div className="text-center">
                        <Button variant="kids" size="lg" onClick={handleNext}>
                          {currentIndex + 1 < questions.length ? '下一題 →' : '查看結果'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold mb-2">安全小勇士！</h2>
            <p className="text-xl mb-4">你完成了交通安全測驗！</p>
            <div className="space-y-2 mb-6">
              <p>完成題數: <span className="font-bold">{questions.length}</span></p>
              <p>正確數: <span className="font-bold">{correctCount}/{questions.length}</span></p>
              <p>正確率: <span className="font-bold">{Math.round((correctCount / questions.length) * 100)}%</span></p>
              <p className="text-2xl">總分: <span className="font-bold">{score}</span></p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 mb-6">
              <p className="text-lg">
                {correctCount === questions.length
                  ? '🎉 滿分！你是交通安全大師！'
                  : correctCount >= questions.length * 0.8
                  ? '👍 很棒！你很懂交通安全！'
                  : correctCount >= questions.length * 0.6
                  ? '💪 不錯！繼續學習會更好！'
                  : '📚 多練習，一定會進步！'}
              </p>
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
