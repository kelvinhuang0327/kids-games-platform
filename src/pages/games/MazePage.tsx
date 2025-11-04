import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'

interface Position {
  x: number
  y: number
}

export const MazePage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  // 4-6歲：5x5 迷宮，7-13歲：8x8 迷宮
  const mazeSize = ageGroup === '4-6' ? 5 : 8
  const cellSize = ageGroup === '4-6' ? 80 : 60

  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 })
  const [goalPos] = useState<Position>({ x: mazeSize - 1, y: mazeSize - 1 })
  const [moves, setMoves] = useState(0)
  const [startTime] = useState(Date.now())
  const [isComplete, setIsComplete] = useState(false)
  const [walls, setWalls] = useState<Set<string>>(new Set())

  useEffect(() => {
    generateMaze()
  }, [])

  useEffect(() => {
    checkComplete()
  }, [playerPos])

  const generateMaze = () => {
    const newWalls = new Set<string>()

    // 簡單的障礙物生成（隨機放置牆壁）
    const wallCount = Math.floor(mazeSize * mazeSize * 0.15)
    for (let i = 0; i < wallCount; i++) {
      const x = Math.floor(Math.random() * mazeSize)
      const y = Math.floor(Math.random() * mazeSize)

      // 不在起點和終點放置牆壁
      if ((x !== 0 || y !== 0) && (x !== mazeSize - 1 || y !== mazeSize - 1)) {
        newWalls.add(`${x},${y}`)
      }
    }

    setWalls(newWalls)
    setPlayerPos({ x: 0, y: 0 })
    setMoves(0)
    setIsComplete(false)
  }

  const checkComplete = () => {
    if (playerPos.x === goalPos.x && playerPos.y === goalPos.y && !isComplete) {
      setIsComplete(true)
      const duration = Date.now() - startTime

      saveResult({
        gameId: 'maze',
        completed: true,
        score: Math.max(1000 - moves * 5, 100),
        duration,
      })
    }
  }

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (isComplete) return

    const newX = playerPos.x + dx
    const newY = playerPos.y + dy

    // 檢查邊界
    if (newX < 0 || newX >= mazeSize || newY < 0 || newY >= mazeSize) {
      return
    }

    // 檢查是否撞牆
    if (walls.has(`${newX},${newY}`)) {
      return
    }

    setPlayerPos({ x: newX, y: newY })
    setMoves(moves + 1)
  }, [playerPos, isComplete, walls, mazeSize, moves])

  // 鍵盤控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          movePlayer(0, -1)
          e.preventDefault()
          break
        case 'ArrowDown':
          movePlayer(0, 1)
          e.preventDefault()
          break
        case 'ArrowLeft':
          movePlayer(-1, 0)
          e.preventDefault()
          break
        case 'ArrowRight':
          movePlayer(1, 0)
          e.preventDefault()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [movePlayer])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🌀 迷宮冒險
            </h1>
            <p className="text-gray-600">
              使用方向鍵或按鈕移動，到達終點！
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
            <Button variant="default" size="sm" onClick={generateMaze}>
              🔄 重新開始
            </Button>
          </div>

          {/* 迷宮網格 */}
          <div
            className="mx-auto border-4 border-gray-800 rounded-xl overflow-hidden"
            style={{
              width: `${mazeSize * cellSize}px`,
              height: `${mazeSize * cellSize}px`
            }}
          >
            <div className="relative w-full h-full bg-gray-100">
              {/* 網格線 */}
              {Array.from({ length: mazeSize }, (_, y) => (
                <div key={`row-${y}`} className="flex">
                  {Array.from({ length: mazeSize }, (_, x) => {
                    const isWall = walls.has(`${x},${y}`)
                    const isPlayer = playerPos.x === x && playerPos.y === y
                    const isGoal = goalPos.x === x && goalPos.y === y
                    const isStart = x === 0 && y === 0

                    return (
                      <div
                        key={`cell-${x}-${y}`}
                        style={{
                          width: `${cellSize}px`,
                          height: `${cellSize}px`
                        }}
                        className={`
                          border border-gray-300
                          flex items-center justify-center
                          text-3xl
                          ${isWall ? 'bg-gray-700' : ''}
                          ${isStart ? 'bg-green-200' : ''}
                          ${isGoal ? 'bg-yellow-200' : ''}
                        `}
                      >
                        {isPlayer && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-4xl"
                          >
                            🚶
                          </motion.div>
                        )}
                        {!isPlayer && isGoal && '🎯'}
                        {!isPlayer && isStart && !isGoal && '🏁'}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* 控制按鈕 */}
          <div className="mt-6">
            <p className="text-center text-gray-600 mb-4">
              💡 使用鍵盤方向鍵或下方按鈕控制
            </p>
            <div className="flex flex-col items-center gap-2">
              <Button
                variant={ageGroup === '4-6' ? 'toddler' : 'kids'}
                size="md"
                onClick={() => movePlayer(0, -1)}
              >
                ⬆️ 上
              </Button>
              <div className="flex gap-2">
                <Button
                  variant={ageGroup === '4-6' ? 'toddler' : 'kids'}
                  size="md"
                  onClick={() => movePlayer(-1, 0)}
                >
                  ⬅️ 左
                </Button>
                <Button
                  variant={ageGroup === '4-6' ? 'toddler' : 'kids'}
                  size="md"
                  onClick={() => movePlayer(1, 0)}
                >
                  ➡️ 右
                </Button>
              </div>
              <Button
                variant={ageGroup === '4-6' ? 'toddler' : 'kids'}
                size="md"
                onClick={() => movePlayer(0, 1)}
              >
                ⬇️ 下
              </Button>
            </div>
          </div>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-400 text-white rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">恭喜通關！</h2>
            <p className="text-xl mb-4">你成功走出迷宮了！</p>
            <p className="mb-6">
              移動次數: <span className="font-bold">{moves}</span> 步
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="default" size="lg" onClick={generateMaze}>
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
