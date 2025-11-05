import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { playSuccessMessage } from '@/utils/audioFeedback'

interface PuzzlePiece {
  id: number
  currentPosition: number
  correctPosition: number
}

export const PuzzlePage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  const pieceCount = ageGroup === '4-6' ? 4 : 9
  const gridSize = ageGroup === '4-6' ? 2 : 3

  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [moves, setMoves] = useState(0)
  const [startTime] = useState(Date.now())
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    initializePuzzle()
  }, [])

  useEffect(() => {
    checkComplete()
  }, [pieces])

  const initializePuzzle = () => {
    const initialPieces: PuzzlePiece[] = Array.from({ length: pieceCount }, (_, i) => ({
      id: i,
      currentPosition: i,
      correctPosition: i,
    }))

    // 隨機打亂
    const shuffled = [...initialPieces]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = shuffled[i].currentPosition
      shuffled[i].currentPosition = shuffled[j].currentPosition
      shuffled[j].currentPosition = temp
    }

    setPieces(shuffled)
    setMoves(0)
    setIsComplete(false)
  }

  const handlePieceClick = (pieceId: number) => {
    if (isComplete) return

    const newPieces = [...pieces]
    const clickedIndex = newPieces.findIndex(p => p.id === pieceId)

    // 找到相鄰的空白位置（這裡簡化為任意交換）
    if (clickedIndex < pieces.length - 1) {
      const temp = newPieces[clickedIndex].currentPosition
      newPieces[clickedIndex].currentPosition = newPieces[clickedIndex + 1].currentPosition
      newPieces[clickedIndex + 1].currentPosition = temp
    }

    setPieces(newPieces)
    setMoves(moves + 1)
  }

  const checkComplete = () => {
    if (pieces.length === 0) return

    const complete = pieces.every(piece => piece.currentPosition === piece.correctPosition)

    if (complete && !isComplete) {
      setIsComplete(true)
      playSuccessMessage()
      const duration = Date.now() - startTime

      saveResult({
        gameId: 'puzzle',
        completed: true,
        score: Math.max(1000 - moves * 10, 0),
        duration,
      })
    }
  }

  const colors = [
    'bg-red-400',
    'bg-blue-400',
    'bg-green-400',
    'bg-yellow-400',
    'bg-purple-400',
    'bg-pink-400',
    'bg-indigo-400',
    'bg-orange-400',
    'bg-teal-400',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🧩 拼圖遊戲
            </h1>
            <p className="text-gray-600">
              移動方塊，將它們排列成正確順序！
            </p>
          </div>
          <Button variant="default" onClick={() => navigate(-1)}>
            ← 返回
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
          <div className="flex justify-between mb-6">
            <div className="text-lg">
              <span className="font-bold">移動次數:</span> {moves}
            </div>
            <Button variant="default" size="sm" onClick={initializePuzzle}>
              🔄 重新開始
            </Button>
          </div>

          <div
            className="grid gap-4 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              maxWidth: `${gridSize * 150}px`
            }}
          >
            {pieces
              .sort((a, b) => a.currentPosition - b.currentPosition)
              .map((piece) => (
                <motion.div
                  key={piece.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePieceClick(piece.id)}
                  className={`
                    ${colors[piece.id]}
                    rounded-xl
                    cursor-pointer
                    flex
                    items-center
                    justify-center
                    text-4xl
                    font-bold
                    text-white
                    shadow-lg
                    aspect-square
                  `}
                >
                  {piece.id + 1}
                </motion.div>
              ))}
          </div>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-400 text-white rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">太棒了！</h2>
            <p className="text-xl mb-4">你完成了拼圖！</p>
            <p className="mb-6">
              移動次數: <span className="font-bold">{moves}</span> 次
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="default" size="lg" onClick={initializePuzzle}>
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
