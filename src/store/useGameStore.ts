import { create } from 'zustand'
import type { GameProgress } from '@/types'
import { storage } from '@/utils/storage'

interface GameResult {
  gameId: string
  completed: boolean
  score: number
  duration: number
}

interface GameState {
  progress: Record<string, GameProgress>
  saveResult: (result: GameResult) => void
  getProgress: (gameId: string) => GameProgress | null
  clearAll: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  progress: storage.get('progress') || {},

  saveResult: (result) => {
    const current = get().progress[result.gameId] || {
      completed: false,
      bestScore: 0,
      bestTime: Infinity,
      attempts: 0,
      lastPlayed: '',
    }

    const updated: GameProgress = {
      completed: result.completed || current.completed,
      bestScore: Math.max(result.score, current.bestScore),
      bestTime: result.duration > 0 ? Math.min(result.duration, current.bestTime) : current.bestTime,
      attempts: current.attempts + 1,
      lastPlayed: new Date().toISOString(),
    }

    set((state) => ({
      progress: {
        ...state.progress,
        [result.gameId]: updated,
      },
    }))

    storage.set('progress', get().progress)
  },

  getProgress: (gameId) => {
    return get().progress[gameId] || null
  },

  clearAll: () => {
    set({ progress: {} })
    storage.set('progress', {})
  },
}))
