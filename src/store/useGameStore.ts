import { create } from 'zustand'
import type { GameResult, GameProgress } from '@/types'
import { storage } from '@/utils/storage'

interface GameState {
  progress: Record<string, GameProgress>
  saveResult: (result: GameResult) => void
  getProgress: (gameId: string) => GameProgress | null
}

export const useGameStore = create<GameState>((set, get) => ({
  progress: storage.get('progress') || {},

  saveResult: (result) => {
    const current = get().progress[result.gameId] || {
      completed: false,
      bestScore: 0,
      bestTime: Infinity,
      attempts: 0,
      lastPlayed: new Date().toISOString(),
    }

    const updated = {
      completed: result.completed || current.completed,
      bestScore: Math.max(result.score, current.bestScore),
      bestTime: Math.min(result.duration, current.bestTime),
      attempts: current.attempts + 1,
      lastPlayed: new Date().toISOString(),
    }

    set((state) => ({
      progress: { ...state.progress, [result.gameId]: updated },
    }))

    storage.set('progress', get().progress)
  },

  getProgress: (gameId) => {
    return get().progress[gameId] || null
  },
}))
