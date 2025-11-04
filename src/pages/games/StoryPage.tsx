import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'

interface StoryNode {
  id: number
  text: string
  emoji: string
  choices?: {
    text: string
    nextId: number
    points: number
  }[]
  isEnding?: boolean
  endingType?: 'good' | 'bad' | 'neutral'
}

// 簡單的森林冒險故事
const STORY_NODES: Record<number, StoryNode> = {
  1: {
    id: 1,
    text: '你在森林裡散步，突然看到一隻小兔子在哭泣。',
    emoji: '🌳',
    choices: [
      { text: '過去詢問兔子為什麼哭', nextId: 2, points: 10 },
      { text: '繼續往前走', nextId: 3, points: 0 },
    ],
  },
  2: {
    id: 2,
    text: '兔子說：「我的胡蘿蔔掉進洞裡了！」',
    emoji: '🐰',
    choices: [
      { text: '幫助兔子拿出胡蘿蔔', nextId: 4, points: 20 },
      { text: '給兔子一個安慰的擁抱', nextId: 5, points: 15 },
    ],
  },
  3: {
    id: 3,
    text: '你繼續走，遇到了一隻友善的狐狸。',
    emoji: '🦊',
    choices: [
      { text: '和狐狸一起玩', nextId: 6, points: 10 },
      { text: '向狐狸問路', nextId: 7, points: 5 },
    ],
  },
  4: {
    id: 4,
    text: '你幫兔子拿出了胡蘿蔔！兔子非常感激，送你一個魔法種子。',
    emoji: '🥕',
    choices: [
      { text: '種下魔法種子', nextId: 8, points: 30 },
      { text: '把種子收起來', nextId: 9, points: 10 },
    ],
  },
  5: {
    id: 5,
    text: '兔子感到安慰，帶你去看美麗的花園。',
    emoji: '🌸',
    choices: [
      { text: '在花園裡休息', nextId: 10, points: 15 },
      { text: '幫忙照顧花園', nextId: 11, points: 25 },
    ],
  },
  6: {
    id: 6,
    text: '你和狐狸成為了好朋友！狐狸教你森林的秘密。',
    emoji: '🎯',
    isEnding: true,
    endingType: 'good',
  },
  7: {
    id: 7,
    text: '狐狸告訴你回家的路，你安全地回到了家。',
    emoji: '🏠',
    isEnding: true,
    endingType: 'neutral',
  },
  8: {
    id: 8,
    text: '種子長成了一棵發光的大樹！你獲得了森林守護者的稱號！',
    emoji: '✨',
    isEnding: true,
    endingType: 'good',
  },
  9: {
    id: 9,
    text: '你保留了種子作為紀念，繼續你的冒險。',
    emoji: '🌟',
    isEnding: true,
    endingType: 'neutral',
  },
  10: {
    id: 10,
    text: '你在美麗的花園裡度過了愉快的時光。',
    emoji: '😌',
    isEnding: true,
    endingType: 'neutral',
  },
  11: {
    id: 11,
    text: '因為你的幫助，花園變得更加美麗！你獲得了「花園小幫手」獎章！',
    emoji: '🏆',
    isEnding: true,
    endingType: 'good',
  },
}

export const StoryPage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  const [currentNodeId, setCurrentNodeId] = useState(1)
  const [totalPoints, setTotalPoints] = useState(0)
  const [history, setHistory] = useState<number[]>([1])
  const [startTime] = useState(Date.now())

  const currentNode = STORY_NODES[currentNodeId]

  const handleChoice = (nextId: number, points: number) => {
    setTotalPoints(totalPoints + points)
    setHistory([...history, nextId])
    setCurrentNodeId(nextId)

    const nextNode = STORY_NODES[nextId]
    if (nextNode.isEnding) {
      const duration = Date.now() - startTime
      saveResult({
        gameId: 'story',
        completed: true,
        score: totalPoints + points,
        duration,
      })
    }
  }

  const resetStory = () => {
    setCurrentNodeId(1)
    setTotalPoints(0)
    setHistory([1])
  }

  const getEndingMessage = () => {
    switch (currentNode.endingType) {
      case 'good':
        return { title: '完美結局！', color: 'from-green-400 to-emerald-400', emoji: '🎉' }
      case 'bad':
        return { title: '結局', color: 'from-orange-400 to-red-400', emoji: '😔' }
      default:
        return { title: '故事結束', color: 'from-blue-400 to-purple-400', emoji: '✨' }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              📖 森林冒險故事
            </h1>
            <p className="text-gray-600">
              選擇你的決定，展開冒險！
            </p>
          </div>
          <Button variant="default" onClick={() => navigate(-1)}>
            ← 返回
          </Button>
        </div>

        <div className="mb-6">
          <div className="bg-white rounded-full px-6 py-3 shadow-lg inline-flex items-center gap-3">
            <span className="font-bold">分數:</span>
            <span className="text-2xl font-bold text-purple-600">{totalPoints}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentNodeId}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-8xl mb-6"
                >
                  {currentNode.emoji}
                </motion.div>
                <p className="text-2xl leading-relaxed text-gray-800">
                  {currentNode.text}
                </p>
              </div>

              {currentNode.isEnding ? (
                <div>
                  <div className={`bg-gradient-to-r ${getEndingMessage().color} text-white rounded-2xl p-8 text-center mb-6`}>
                    <div className="text-6xl mb-4">{getEndingMessage().emoji}</div>
                    <h2 className="text-3xl font-bold mb-2">{getEndingMessage().title}</h2>
                    <p className="text-xl mb-4">你的最終分數</p>
                    <div className="text-5xl font-bold">{totalPoints}</div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button
                      variant={ageGroup === '4-6' ? 'toddler' : 'kids'}
                      size="lg"
                      onClick={resetStory}
                    >
                      🔄 重新開始
                    </Button>
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => navigate(-1)}
                    >
                      返回遊戲大廳
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentNode.choices?.map((choice, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <Button
                        variant={ageGroup === '4-6' ? 'toddler' : 'kids'}
                        size="lg"
                        onClick={() => handleChoice(choice.nextId, choice.points)}
                        className="w-full text-left justify-start text-lg py-6"
                      >
                        <span className="mr-3">{index + 1}.</span>
                        {choice.text}
                        {choice.points > 0 && (
                          <span className="ml-auto text-sm opacity-75">+{choice.points} 分</span>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {history.length > 1 && !currentNode.isEnding && (
          <div className="text-center">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                const newHistory = history.slice(0, -1)
                setHistory(newHistory)
                setCurrentNodeId(newHistory[newHistory.length - 1])
              }}
            >
              ⬅️ 返回上一步
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
