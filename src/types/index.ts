export type AgeGroup = '4-6' | '7-13'

export interface GameConfig {
  id: string
  name: string
  displayName: string
  description: string
  icon: string
  ageGroups: AgeGroup[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface GameProgress {
  completed: boolean
  bestScore: number
  bestTime: number
  attempts: number
  lastPlayed: string
}

export interface Settings {
  ageGroup: AgeGroup | null
  soundEnabled: boolean
  musicEnabled: boolean
  voiceEnabled: boolean
}

export interface ParentalControl {
  dailyLimit: number
  todayUsage: number
  lastResetDate: string
  allowedGames: string[]
  disabledGames: string[]
}

export interface StorageSchema {
  settings: Settings
  progress: Record<string, GameProgress>
  parental: ParentalControl
}
