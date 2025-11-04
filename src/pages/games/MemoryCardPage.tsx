import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮']

export const MemoryCardPage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  // 4-6歲：8張卡片（4對），7-13歲：16張卡片（8對）
  const pairCount = ageGroup === '4-6' ? 4 : 8

  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [startTime] = useState(Date.now())
  const [isComplete, setIsComplete] = useState(false)
  const [canFlip, setCanFlip] = useState(true)

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (matches === pairCount && matches > 0) {
      completeGame()
    }
  }, [matches])

  const initializeGame = () => {
    const selectedEmojis = EMOJIS.slice(0, pairCount)
    const cardPairs = [...selectedEmojis, ...selectedEmojis]

    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setIsComplete(false)
    setCanFlip(true)
  }

  const handleCardClick = (cardId: number) => {
    if (!canFlip) return

    const card = cards[cardId]
    if (card.isFlipped || card.isMatched) return
    if (flippedCards.includes(cardId)) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    const newCards = [...cards]
    newCards[cardId].isFlipped = true
    setCards(newCards)

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)
      setCanFlip(false)

      const [first, second] = newFlippedCards
      const firstCard = cards[first]
      const secondCard = cards[second]

      if (firstCard.emoji === secondCard.emoji) {
        // 配對成功
        setTimeout(() => {
          const updatedCards = [...cards]
          updatedCards[first].isMatched = true
          updatedCards[second].isMatched = true
          setCards(updatedCards)
          setFlippedCards([])
          setMatches(matches + 1)
          setCanFlip(true)
        }, 500)
      } else {
        // 配對失敗
        setTimeout(() => {
          const updatedCards = [...cards]
          updatedCards[first].isFlipped = false
          updatedCards[second].isFlipped = false
          setCards(updatedCards)
          setFlippedCards([])
          setCanFlip(true)
        }, 1000)
      }
    }
  }

  const completeGame = () => {
    setIsComplete(true)
    const duration = Date.now() - startTime

    saveResult({
      gameId: 'memory',
      completed: true,
      score: Math.max(2000 - moves * 10, 100),
      duration,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🎴 記憶翻牌
            </h1>
            <p className="text-gray-600">
              翻開卡片，找出相同的一對！
            </p>
          </div>
          <Button variant="default" onClick={() => navigate(-1)}>
            ← 返回
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
          <div className="flex justify-between mb-8">
            <div className="text-lg">
              <span className="font-bold">移動次數:</span> {moves}
            </div>
            <div className="text-lg">
              <span className="font-bold">配對:</span> {matches} / {pairCount}
            </div>
            <Button variant="default" size="sm" onClick={initializeGame}>
              🔄 重新開始
            </Button>
          </div>

          <div
            className={`grid gap-4 mx-auto`}
            style={{
              gridTemplateColumns: `repeat(${pairCount === 4 ? 4 : 4}, 1fr)`,
              maxWidth: pairCount === 4 ? '400px' : '600px'
            }}
          >
            {cards.map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ scale: canFlip && !card.isMatched ? 1.05 : 1 }}
                whileTap={{ scale: canFlip && !card.isMatched ? 0.95 : 1 }}
                onClick={() => handleCardClick(card.id)}
                className={`
                  aspect-square
                  rounded-xl
                  shadow-lg
                  cursor-pointer
                  flex
                  items-center
                  justify-center
                  text-5xl
                  font-bold
                  transition-all
                  ${card.isFlipped || card.isMatched
                    ? 'bg-white'
                    : 'bg-gradient-to-br from-purple-500 to-indigo-500'
                  }
                  ${card.isMatched ? 'opacity-50' : ''}
                `}
              >
                {card.isFlipped || card.isMatched ? (
                  <motion.div
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {card.emoji}
                  </motion.div>
                ) : (
                  <span className="text-white text-6xl">?</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">恭喜過關！</h2>
            <p className="text-xl mb-4">你找到了所有配對！</p>
            <p className="mb-6">
              使用了 <span className="font-bold">{moves}</span> 次移動
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="default" size="lg" onClick={initializeGame}>
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
