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

interface Enemy {
  id: number
  pos: Position
  direction: 'up' | 'down' | 'left' | 'right'
}

// 策略迷宮：更難的迷宮，包含移動敵人、鑰匙、陷阱等
export const StrategyMazePage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  // 只允許 7-13 歲玩
  const mazeSize = 12
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 })
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [walls, setWalls] = useState<Set<string>>(new Set())
  const [traps, setTraps] = useState<Set<string>>(new Set())
  const [keys, setKeys] = useState<Set<string>>(new Set())
  const [collectedKeys, setCollectedKeys] = useState(0)
  const [requiredKeys] = useState(3)
  const [goalPos] = useState<Position>({ x: mazeSize - 1, y: mazeSize - 1 })
  const [moves, setMoves] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [startTime] = useState(Date.now())
  const [health, setHealth] = useState(3)

  // 如果是 4-6 歲，重定向
  useEffect(() => {
    if (ageGroup === '4-6') {
      alert('這個遊戲只適合 7-13 歲的小朋友哦！')
      navigate(-1)
    }
  }, [ageGroup, navigate])

  useEffect(() => {
    generateMaze()
  }, [])

  // 敵人移動計時器
  useEffect(() => {
    if (isComplete || gameOver) return

    const interval = setInterval(() => {
      moveEnemies()
    }, 1000)

    return () => clearInterval(interval)
  }, [enemies, isComplete, gameOver])

  const generateMaze = () => {
    const newWalls = new Set<string>()
    const newTraps = new Set<string>()
    const newKeys = new Set<string>()
    const newEnemies: Enemy[] = []

    // 生成隨機牆壁（30% 機率）
    for (let x = 0; x < mazeSize; x++) {
      for (let y = 0; y < mazeSize; y++) {
        // 不在起點、終點、關鍵路徑上放牆
        if ((x === 0 && y === 0) || (x === mazeSize - 1 && y === mazeSize - 1)) continue

        if (Math.random() < 0.25) {
          newWalls.add(`${x},${y}`)
        }
      }
    }

    // 生成陷阱（15 個）
    let trapCount = 0
    while (trapCount < 15) {
      const x = Math.floor(Math.random() * mazeSize)
      const y = Math.floor(Math.random() * mazeSize)
      const key = `${x},${y}`

      if (!newWalls.has(key) && !(x === 0 && y === 0) && !(x === mazeSize - 1 && y === mazeSize - 1)) {
        newTraps.add(key)
        trapCount++
      }
    }

    // 生成鑰匙（3 個）
    let keyCount = 0
    while (keyCount < requiredKeys) {
      const x = Math.floor(Math.random() * mazeSize)
      const y = Math.floor(Math.random() * mazeSize)
      const key = `${x},${y}`

      if (!newWalls.has(key) && !newTraps.has(key) && !(x === 0 && y === 0)) {
        newKeys.add(key)
        keyCount++
      }
    }

    // 生成敵人（5 個）
    let enemyCount = 0
    while (enemyCount < 5) {
      const x = Math.floor(Math.random() * mazeSize)
      const y = Math.floor(Math.random() * mazeSize)
      const key = `${x},${y}`

      if (!newWalls.has(key) && !(x === 0 && y === 0) && !(x === mazeSize - 1 && y === mazeSize - 1)) {
        newEnemies.push({
          id: enemyCount,
          pos: { x, y },
          direction: ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)] as any,
        })
        enemyCount++
      }
    }

    setWalls(newWalls)
    setTraps(newTraps)
    setKeys(newKeys)
    setEnemies(newEnemies)
    setPlayerPos({ x: 0, y: 0 })
    setMoves(0)
    setCollectedKeys(0)
    setHealth(3)
    setIsComplete(false)
    setGameOver(false)
  }

  const moveEnemies = useCallback(() => {
    setEnemies((prevEnemies) => {
      return prevEnemies.map((enemy) => {
        const directions = [
          { dx: 0, dy: -1, dir: 'up' as const },
          { dx: 0, dy: 1, dir: 'down' as const },
          { dx: -1, dy: 0, dir: 'left' as const },
          { dx: 1, dy: 0, dir: 'right' as const },
        ]

        // 隨機改變方向（30% 機率）
        let currentDir = enemy.direction
        if (Math.random() < 0.3) {
          currentDir = directions[Math.floor(Math.random() * 4)].dir
        }

        const dirData = directions.find(d => d.dir === currentDir)!
        const newX = enemy.pos.x + dirData.dx
        const newY = enemy.pos.y + dirData.dy

        // 檢查邊界和牆壁
        if (
          newX >= 0 &&
          newX < mazeSize &&
          newY >= 0 &&
          newY < mazeSize &&
          !walls.has(`${newX},${newY}`)
        ) {
          return { ...enemy, pos: { x: newX, y: newY }, direction: currentDir }
        }

        // 如果撞牆，換方向
        const newDir = directions[Math.floor(Math.random() * 4)].dir
        return { ...enemy, direction: newDir }
      })
    })
  }, [walls, mazeSize])

  // 檢查敵人碰撞
  useEffect(() => {
    if (gameOver || isComplete) return

    const hit = enemies.some(
      (enemy) => enemy.pos.x === playerPos.x && enemy.pos.y === playerPos.y
    )

    if (hit) {
      const newHealth = health - 1
      setHealth(newHealth)

      if (newHealth <= 0) {
        setGameOver(true)
        saveResult({
          gameId: 'strategy-maze',
          completed: false,
          score: Math.max(collectedKeys * 100 - moves, 0),
          duration: Date.now() - startTime,
        })
      } else {
        // 返回起點
        setPlayerPos({ x: 0, y: 0 })
      }
    }
  }, [playerPos, enemies, health, gameOver, isComplete])

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (isComplete || gameOver) return

      const newX = playerPos.x + dx
      const newY = playerPos.y + dy

      // 檢查邊界
      if (newX < 0 || newX >= mazeSize || newY < 0 || newY >= mazeSize) return

      // 檢查牆壁
      if (walls.has(`${newX},${newY}`)) return

      const newPos = { x: newX, y: newY }
      setPlayerPos(newPos)
      setMoves(moves + 1)

      // 檢查陷阱
      const posKey = `${newX},${newY}`
      if (traps.has(posKey)) {
        const newHealth = health - 1
        setHealth(newHealth)

        if (newHealth <= 0) {
          setGameOver(true)
          saveResult({
            gameId: 'strategy-maze',
            completed: false,
            score: Math.max(collectedKeys * 100 - moves, 0),
            duration: Date.now() - startTime,
          })
        }
      }

      // 檢查鑰匙
      if (keys.has(posKey)) {
        setCollectedKeys(collectedKeys + 1)
        const newKeys = new Set(keys)
        newKeys.delete(posKey)
        setKeys(newKeys)
      }

      // 檢查終點
      if (newX === goalPos.x && newY === goalPos.y) {
        if (collectedKeys >= requiredKeys) {
          setIsComplete(true)
          const duration = Date.now() - startTime
          const score = Math.max(2000 - moves * 5 + collectedKeys * 100, 0)

          saveResult({
            gameId: 'strategy-maze',
            completed: true,
            score,
            duration,
          })
        }
      }
    },
    [playerPos, walls, traps, keys, collectedKeys, isComplete, gameOver, moves, health, goalPos, requiredKeys, startTime, saveResult, mazeSize]
  )

  // 鍵盤控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          movePlayer(0, -1)
          break
        case 'ArrowDown':
          e.preventDefault()
          movePlayer(0, 1)
          break
        case 'ArrowLeft':
          e.preventDefault()
          movePlayer(-1, 0)
          break
        case 'ArrowRight':
          e.preventDefault()
          movePlayer(1, 0)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [movePlayer])

  const cellSize = 40

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-indigo-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🎯 策略迷宮
            </h1>
            <p className="text-gray-600">
              避開敵人和陷阱，收集 {requiredKeys} 把鑰匙到達終點！
            </p>
          </div>
          <Button variant="default" onClick={() => navigate(-1)}>
            ← 返回
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
          <div className="flex flex-wrap gap-6 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">移動:</span>
              <span className="text-2xl">{moves}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">鑰匙:</span>
              <span className="text-2xl">{collectedKeys}/{requiredKeys}</span>
              <span className="text-3xl">🔑</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">生命:</span>
              <span className="text-2xl">
                {'❤️'.repeat(health)}{'🖤'.repeat(3 - health)}
              </span>
            </div>
            <Button variant="default" size="sm" onClick={generateMaze}>
              🔄 重新開始
            </Button>
          </div>

          <div className="mb-4 text-sm text-gray-600 space-y-1">
            <div>🟦 玩家 | 🟥 敵人（會移動！） | ⬛ 牆壁</div>
            <div>🔑 鑰匙 | 🕳️ 陷阱 | 🏁 終點（需要 {requiredKeys} 把鑰匙）</div>
            <div>使用方向鍵或按鈕移動。小心敵人和陷阱！</div>
          </div>

          <div className="flex gap-6 items-start">
            {/* 迷宮 */}
            <div
              className="relative bg-gray-100 border-4 border-gray-800"
              style={{
                width: mazeSize * cellSize,
                height: mazeSize * cellSize,
              }}
            >
              {/* 網格線 */}
              {Array.from({ length: mazeSize }).map((_, y) =>
                Array.from({ length: mazeSize }).map((_, x) => (
                  <div
                    key={`${x},${y}`}
                    className="absolute border border-gray-300"
                    style={{
                      left: x * cellSize,
                      top: y * cellSize,
                      width: cellSize,
                      height: cellSize,
                    }}
                  />
                ))
              )}

              {/* 牆壁 */}
              {Array.from(walls).map((wall) => {
                const [x, y] = wall.split(',').map(Number)
                return (
                  <div
                    key={wall}
                    className="absolute bg-gray-800"
                    style={{
                      left: x * cellSize,
                      top: y * cellSize,
                      width: cellSize,
                      height: cellSize,
                    }}
                  >
                    <div className="flex items-center justify-center h-full text-xs">
                      ⬛
                    </div>
                  </div>
                )
              })}

              {/* 陷阱 */}
              {Array.from(traps).map((trap) => {
                const [x, y] = trap.split(',').map(Number)
                return (
                  <div
                    key={trap}
                    className="absolute flex items-center justify-center"
                    style={{
                      left: x * cellSize,
                      top: y * cellSize,
                      width: cellSize,
                      height: cellSize,
                    }}
                  >
                    <span className="text-2xl">🕳️</span>
                  </div>
                )
              })}

              {/* 鑰匙 */}
              {Array.from(keys).map((key) => {
                const [x, y] = key.split(',').map(Number)
                return (
                  <motion.div
                    key={key}
                    className="absolute flex items-center justify-center"
                    style={{
                      left: x * cellSize,
                      top: y * cellSize,
                      width: cellSize,
                      height: cellSize,
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <span className="text-2xl">🔑</span>
                  </motion.div>
                )
              })}

              {/* 終點 */}
              <div
                className="absolute flex items-center justify-center bg-green-200"
                style={{
                  left: goalPos.x * cellSize,
                  top: goalPos.y * cellSize,
                  width: cellSize,
                  height: cellSize,
                }}
              >
                <span className="text-2xl">🏁</span>
              </div>

              {/* 敵人 */}
              {enemies.map((enemy) => (
                <motion.div
                  key={enemy.id}
                  className="absolute flex items-center justify-center bg-red-300 rounded"
                  style={{
                    left: enemy.pos.x * cellSize,
                    top: enemy.pos.y * cellSize,
                    width: cellSize,
                    height: cellSize,
                  }}
                  animate={{
                    left: enemy.pos.x * cellSize,
                    top: enemy.pos.y * cellSize,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-2xl">👹</span>
                </motion.div>
              ))}

              {/* 玩家 */}
              <motion.div
                className="absolute flex items-center justify-center bg-blue-400 rounded-full z-10"
                style={{
                  left: playerPos.x * cellSize,
                  top: playerPos.y * cellSize,
                  width: cellSize,
                  height: cellSize,
                }}
                animate={{
                  left: playerPos.x * cellSize,
                  top: playerPos.y * cellSize,
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-2xl">🧑</span>
              </motion.div>
            </div>

            {/* 按鈕控制 */}
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="kids"
                size="md"
                onClick={() => movePlayer(0, -1)}
                disabled={isComplete || gameOver}
              >
                ⬆️ 上
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="kids"
                  size="md"
                  onClick={() => movePlayer(-1, 0)}
                  disabled={isComplete || gameOver}
                >
                  ⬅️ 左
                </Button>
                <Button
                  variant="kids"
                  size="md"
                  onClick={() => movePlayer(0, 1)}
                  disabled={isComplete || gameOver}
                >
                  ⬇️ 下
                </Button>
                <Button
                  variant="kids"
                  size="md"
                  onClick={() => movePlayer(1, 0)}
                  disabled={isComplete || gameOver}
                >
                  ➡️ 右
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 完成畫面 */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">策略大師！</h2>
            <p className="text-xl mb-4">你成功完成了策略迷宮！</p>
            <div className="space-y-2 mb-6">
              <p>移動次數: <span className="font-bold">{moves}</span></p>
              <p>收集鑰匙: <span className="font-bold">{collectedKeys}/{requiredKeys}</span></p>
              <p>剩餘生命: <span className="font-bold">{health}/3</span></p>
            </div>
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

        {/* 遊戲結束畫面 */}
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-red-400 to-orange-400 text-white rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-3xl font-bold mb-2">遊戲結束</h2>
            <p className="text-xl mb-4">生命值歸零了！</p>
            <div className="space-y-2 mb-6">
              <p>移動次數: <span className="font-bold">{moves}</span></p>
              <p>收集鑰匙: <span className="font-bold">{collectedKeys}/{requiredKeys}</span></p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="default" size="lg" onClick={generateMaze}>
                再試一次
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
