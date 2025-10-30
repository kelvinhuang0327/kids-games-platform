import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './useGameStore'

describe('Game Store', () => {
  beforeEach(() => {
    // 重置 store 狀態
    localStorage.clear()
    useGameStore.setState({
      progress: {},
    })
  })

  it('應該有空的初始進度', () => {
    const state = useGameStore.getState()
    expect(state.progress).toEqual({})
  })

  it('應該能夠保存遊戲結果', () => {
    const { saveResult } = useGameStore.getState()

    saveResult({
      gameId: 'puzzle',
      completed: true,
      score: 100,
      duration: 60000,
    })

    const progress = useGameStore.getState().progress
    expect(progress.puzzle).toBeDefined()
    expect(progress.puzzle.completed).toBe(true)
    expect(progress.puzzle.bestScore).toBe(100)
    expect(progress.puzzle.attempts).toBe(1)
  })

  it('應該更新最佳分數', () => {
    const { saveResult } = useGameStore.getState()

    // 第一次遊戲: 分數 50
    saveResult({
      gameId: 'puzzle',
      completed: true,
      score: 50,
      duration: 60000,
    })

    // 第二次遊戲: 分數 100
    saveResult({
      gameId: 'puzzle',
      completed: true,
      score: 100,
      duration: 50000,
    })

    const progress = useGameStore.getState().progress
    expect(progress.puzzle.bestScore).toBe(100)
    expect(progress.puzzle.attempts).toBe(2)
  })

  it('應該更新最佳時間', () => {
    const { saveResult } = useGameStore.getState()

    // 第一次: 60 秒
    saveResult({
      gameId: 'puzzle',
      completed: true,
      score: 100,
      duration: 60000,
    })

    // 第二次: 30 秒（更快）
    saveResult({
      gameId: 'puzzle',
      completed: true,
      score: 100,
      duration: 30000,
    })

    const progress = useGameStore.getState().progress
    expect(progress.puzzle.bestTime).toBe(30000)
  })

  it('應該能夠獲取遊戲進度', () => {
    const { saveResult, getProgress } = useGameStore.getState()

    saveResult({
      gameId: 'maze',
      completed: false,
      score: 50,
      duration: 45000,
    })

    const progress = getProgress('maze')
    expect(progress).toBeDefined()
    expect(progress?.completed).toBe(false)
    expect(progress?.bestScore).toBe(50)
  })

  it('不存在的遊戲應該返回 null', () => {
    const { getProgress } = useGameStore.getState()

    const progress = getProgress('nonexistent')
    expect(progress).toBeNull()
  })

  it('多個遊戲的進度應該分開記錄', () => {
    const { saveResult } = useGameStore.getState()

    saveResult({
      gameId: 'puzzle',
      completed: true,
      score: 100,
      duration: 60000,
    })

    saveResult({
      gameId: 'maze',
      completed: true,
      score: 80,
      duration: 45000,
    })

    const progress = useGameStore.getState().progress
    expect(Object.keys(progress)).toHaveLength(2)
    expect(progress.puzzle.bestScore).toBe(100)
    expect(progress.maze.bestScore).toBe(80)
  })
})
