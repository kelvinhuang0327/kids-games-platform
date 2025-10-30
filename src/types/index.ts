// 年齡組類型
export type AgeGroup = '4-6' | '7-13'

// 遊戲配置
export interface GameConfig {
  id: string
  name: string
  displayName: string
  description: string
  icon: string
  ageGroups: AgeGroup[]
  difficulty: 'easy' | 'medium' | 'hard'
}

// 遊戲結果
export interface GameResult {
  gameId: string
  completed: boolean
  score: number
  duration: number
}

// 遊戲進度
export interface GameProgress {
  completed: boolean
  bestScore: number
  bestTime: number
  attempts: number
  lastPlayed: string
}

// 設定
export interface Settings {
  ageGroup: AgeGroup | null
  soundEnabled: boolean
  musicEnabled: boolean
  voiceEnabled: boolean
}

// 家長控制
export interface ParentalControl {
  dailyLimit: number
  todayUsage: number
  lastResetDate: string
  allowedGames: string[]
  disabledGames: string[]
}

// LocalStorage Schema
export interface StorageSchema {
  settings: Settings
  progress: Record<string, GameProgress>
  parental: ParentalControl
}
