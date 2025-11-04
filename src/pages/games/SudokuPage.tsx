import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'

type Cell = {
  value: number
  isFixed: boolean
  isError: boolean
}

// 4x4 數獨（適合初學者）
export const SudokuPage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  const [grid, setGrid] = useState<Cell[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [moves, setMoves] = useState(0)
  const [hints, setHints] = useState(3)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())

  // 只允許 7-13 歲玩
  useEffect(() => {
    if (ageGroup === '4-6') {
      alert('這個遊戲只適合 7-13 歲的小朋友哦！')
      navigate(-1)
    }
  }, [ageGroup, navigate])

  useEffect(() => {
    generatePuzzle()
  }, [])

  // 生成完整的 4x4 數獨解答
  const generateSolution = (): number[][] => {
    const grid: number[][] = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]

    // 簡單的生成方式：隨機填充第一行，然後按規則推導
    const firstRow = [1, 2, 3, 4].sort(() => Math.random() - 0.5)
    grid[0] = firstRow

    // 第二行：循環移位
    grid[1] = [firstRow[2], firstRow[3], firstRow[0], firstRow[1]]

    // 第三行：再次移位
    grid[2] = [firstRow[1], firstRow[0], firstRow[3], firstRow[2]]

    // 第四行：最後移位
    grid[3] = [firstRow[3], firstRow[2], firstRow[1], firstRow[0]]

    return grid
  }

  // 從完整解答中移除一些數字生成謎題
  const generatePuzzle = () => {
    const solution = generateSolution()
    const newGrid: Cell[][] = solution.map((row) =>
      row.map((value) => ({
        value,
        isFixed: false,
        isError: false,
      }))
    )

    // 移除 8-10 個數字（保留 6-8 個）
    const cellsToRemove = 8 + Math.floor(Math.random() * 3)
    let removed = 0

    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 4)
      const col = Math.floor(Math.random() * 4)

      if (newGrid[row][col].value !== 0) {
        newGrid[row][col].value = 0
        removed++
      }
    }

    // 標記固定的數字
    newGrid.forEach((row) => {
      row.forEach((cell) => {
        if (cell.value !== 0) {
          cell.isFixed = true
        }
      })
    })

    setGrid(newGrid)
    setSelectedCell(null)
    setMoves(0)
    setHints(3)
    setIsComplete(false)
  }

  // 檢查數字是否有效
  const isValid = (grid: Cell[][], row: number, col: number, num: number): boolean => {
    // 檢查行
    for (let c = 0; c < 4; c++) {
      if (c !== col && grid[row][c].value === num) return false
    }

    // 檢查列
    for (let r = 0; r < 4; r++) {
      if (r !== row && grid[r][col].value === num) return false
    }

    // 檢查 2x2 區塊
    const blockRow = Math.floor(row / 2) * 2
    const blockCol = Math.floor(col / 2) * 2

    for (let r = blockRow; r < blockRow + 2; r++) {
      for (let c = blockCol; c < blockCol + 2; c++) {
        if ((r !== row || c !== col) && grid[r][c].value === num) return false
      }
    }

    return true
  }

  // 填入數字
  const fillNumber = (num: number) => {
    if (!selectedCell || isComplete) return

    const { row, col } = selectedCell
    if (grid[row][col].isFixed) return

    const newGrid = grid.map((r) => r.map((c) => ({ ...c })))

    newGrid[row][col].value = num
    newGrid[row][col].isError = !isValid(newGrid, row, col, num)

    setGrid(newGrid)
    setMoves(moves + 1)

    // 檢查是否完成
    checkComplete(newGrid)
  }

  // 清除選中的格子
  const clearCell = () => {
    if (!selectedCell || isComplete) return

    const { row, col } = selectedCell
    if (grid[row][col].isFixed) return

    const newGrid = grid.map((r) => r.map((c) => ({ ...c })))
    newGrid[row][col].value = 0
    newGrid[row][col].isError = false

    setGrid(newGrid)
  }

  // 使用提示
  const useHint = () => {
    if (hints <= 0 || isComplete) return

    // 找到第一個空格或錯誤的格子
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!grid[row][col].isFixed && (grid[row][col].value === 0 || grid[row][col].isError)) {
          // 找到正確答案（暴力嘗試 1-4）
          for (let num = 1; num <= 4; num++) {
            const testGrid = grid.map((r) => r.map((c) => ({ ...c })))
            testGrid[row][col].value = num

            if (isValid(testGrid, row, col, num)) {
              const newGrid = grid.map((r) => r.map((c) => ({ ...c })))
              newGrid[row][col].value = num
              newGrid[row][col].isError = false
              newGrid[row][col].isFixed = true // 提示的格子變成固定的

              setGrid(newGrid)
              setHints(hints - 1)
              setSelectedCell({ row, col })

              // 檢查是否完成
              checkComplete(newGrid)
              return
            }
          }
        }
      }
    }
  }

  // 檢查是否完成
  const checkComplete = (currentGrid: Cell[][]) => {
    // 檢查是否所有格子都填滿且無錯誤
    const allFilled = currentGrid.every((row) => row.every((cell) => cell.value !== 0))
    const noErrors = currentGrid.every((row) => row.every((cell) => !cell.isError))

    if (allFilled && noErrors) {
      setIsComplete(true)
      const duration = Date.now() - startTime
      const score = Math.max(1500 - moves * 10 + hints * 50, 0)

      saveResult({
        gameId: 'sudoku',
        completed: true,
        score,
        duration,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🧮 數獨入門
            </h1>
            <p className="text-gray-600">
              在每行、每列、每個 2x2 區塊中填入 1-4，不重複！
            </p>
          </div>
          <Button variant="default" onClick={() => navigate(-1)}>
            ← 返回
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-6">
              <div>
                <span className="font-bold">移動次數:</span> {moves}
              </div>
              <div>
                <span className="font-bold">剩餘提示:</span> {hints} 💡
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="kids" size="sm" onClick={useHint} disabled={hints <= 0 || isComplete}>
                💡 提示
              </Button>
              <Button variant="default" size="sm" onClick={generatePuzzle}>
                🔄 新遊戲
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            點擊格子選擇，然後點擊下方數字填入。藍色數字是題目，黑色數字是你填的。
          </div>

          {/* 數獨網格 */}
          <div className="flex justify-center mb-6">
            <div className="inline-block border-4 border-gray-800">
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => (
                    <motion.button
                      key={`${rowIndex}-${colIndex}`}
                      whileHover={{ scale: cell.isFixed ? 1 : 1.05 }}
                      whileTap={{ scale: cell.isFixed ? 1 : 0.95 }}
                      onClick={() => !cell.isFixed && setSelectedCell({ row: rowIndex, col: colIndex })}
                      className={`
                        w-20 h-20 text-3xl font-bold
                        border-2
                        ${colIndex % 2 === 1 ? 'border-r-4' : ''}
                        ${rowIndex % 2 === 1 ? 'border-b-4' : ''}
                        ${cell.isFixed ? 'bg-blue-50 text-blue-600 cursor-default' : 'bg-white cursor-pointer'}
                        ${cell.isError ? 'bg-red-100 text-red-600' : ''}
                        ${
                          selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                            ? 'ring-4 ring-yellow-400'
                            : ''
                        }
                        ${!cell.isFixed && !cell.isError ? 'hover:bg-gray-50' : ''}
                      `}
                      disabled={cell.isFixed}
                    >
                      {cell.value !== 0 ? cell.value : ''}
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 數字按鈕 */}
          <div className="flex justify-center gap-4 mb-4">
            {[1, 2, 3, 4].map((num) => (
              <Button
                key={num}
                variant="kids"
                size="lg"
                onClick={() => fillNumber(num)}
                disabled={!selectedCell || selectedCell && grid[selectedCell.row][selectedCell.col].isFixed}
                className="w-16 h-16 text-2xl"
              >
                {num}
              </Button>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              variant="default"
              size="md"
              onClick={clearCell}
              disabled={!selectedCell || selectedCell && grid[selectedCell.row][selectedCell.col].isFixed}
            >
              ❌ 清除
            </Button>
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
            <h2 className="text-3xl font-bold mb-2">邏輯大師！</h2>
            <p className="text-xl mb-4">你成功完成數獨！</p>
            <div className="space-y-2 mb-6">
              <p>移動次數: <span className="font-bold">{moves}</span></p>
              <p>剩餘提示: <span className="font-bold">{hints}</span></p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="default" size="lg" onClick={generatePuzzle}>
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
