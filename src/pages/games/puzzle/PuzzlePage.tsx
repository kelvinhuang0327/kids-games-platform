import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'

export const PuzzlePage = () => {
  const navigate = useNavigate()
  const { saveResult } = useGameStore()
  const { ageGroup } = useSettingsStore()
  const [pieces, setPieces] = useState<number>(ageGroup === '4-6' ? 4 : 9)
  const [placed, setPlaced] = useState<Set<number>>(new Set())
  const [startTime] = useState(Date.now())
  const [completed, setCompleted] = useState(false)

  const progress = (placed.size / pieces) * 100

  useEffect(() => {
    if (placed.size === pieces && !completed) {
      setCompleted(true)
      const duration = Date.now() - startTime
      saveResult({
        gameId: 'puzzle',
        completed: true,
        score: 100,
        duration,
      })
    }
  }, [placed.size, pieces, completed, startTime, saveResult])

  const handlePieceClick = (index: number) => {
    if (!placed.has(index)) {
      setPlaced(new Set([...placed, index]))
    }
  }

  const handleReset = () => {
    setPlaced(new Set())
    setCompleted(false)
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="bg-white rounded-3xl p-12 shadow-2xl text-center"
        >
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-5xl font-bold mb-4">太棒了！</h2>
          <p className="text-2xl mb-8 text-gray-600">
            用時: {Math.round((Date.now() - startTime) / 1000)} 秒
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="default" onClick={handleReset}>
              再玩一次
            </Button>
            <Button variant="kids" onClick={() => navigate(-1)}>
              返回大廳
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🧩 拼圖遊戲</h1>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleReset}>
              🔄 重新開始
            </Button>
            <Button size="sm" onClick={() => navigate(-1)}>
              ← 返回
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex items-center gap-4">
            <span className="font-bold">進度:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
              <motion.div
                className="bg-green-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="font-bold">{placed.size}/{pieces}</span>
          </div>
        </div>

        {/* Puzzle Board */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div
            className="grid gap-4 max-w-2xl mx-auto"
            style={{
              gridTemplateColumns: `repeat(${Math.sqrt(pieces)}, 1fr)`,
            }}
          >
            {Array.from({ length: pieces }).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-2xl text-4xl font-bold flex items-center justify-center transition-all ${
                  placed.has(index)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => handlePieceClick(index)}
                disabled={placed.has(index)}
              >
                {placed.has(index) ? '✓' : index + 1}
              </motion.button>
            ))}
          </div>
        </div>

        <p className="text-center mt-6 text-gray-600">
          點擊方塊完成拼圖（簡化版演示）
        </p>
      </div>
    </div>
  )
}
