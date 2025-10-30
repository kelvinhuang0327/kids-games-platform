import type { AgeGroup, GameConfig } from '@/types'

// 年齡組配置
export const AGE_GROUPS: Record<AgeGroup, { name: string; color: string; bg: string }> = {
  '4-6': {
    name: '寶寶樂園',
    color: '#FF6B9D',
    bg: '#FFF9E6',
  },
  '7-13': {
    name: '小學天地',
    color: '#4A90E2',
    bg: '#F5F8FF',
  },
}

// 遊戲配置
export const GAMES: Record<string, GameConfig> = {
  puzzle: {
    id: 'puzzle',
    name: 'puzzle',
    displayName: '拼圖',
    description: '鍛煉空間認知能力',
    icon: '🧩',
    ageGroups: ['4-6', '7-13'],
    difficulty: 'easy',
  },
  maze: {
    id: 'maze',
    name: 'maze',
    displayName: '迷宮',
    description: '訓練邏輯思維',
    icon: '🌀',
    ageGroups: ['4-6', '7-13'],
    difficulty: 'medium',
  },
  comic: {
    id: 'comic',
    name: 'comic',
    displayName: '互動漫畫',
    description: '啟發創意想像',
    icon: '📖',
    ageGroups: ['4-6', '7-13'],
    difficulty: 'easy',
  },
  math: {
    id: 'math',
    name: 'math',
    displayName: '數學挑戰',
    description: '提升運算能力',
    icon: '🔢',
    ageGroups: ['7-13'],
    difficulty: 'medium',
  },
  coding: {
    id: 'coding',
    name: 'coding',
    displayName: '程式邏輯',
    description: '培養運算思維',
    icon: '💻',
    ageGroups: ['7-13'],
    difficulty: 'hard',
  },
  edx: {
    id: 'edx',
    name: 'edx',
    displayName: 'EdX推薦',
    description: '優質教育資源',
    icon: '🎓',
    ageGroups: ['7-13'],
    difficulty: 'medium',
  },
}

// 預設設定
export const DEFAULT_SETTINGS = {
  ageGroup: null,
  soundEnabled: true,
  musicEnabled: true,
  voiceEnabled: true,
}

// 預設家長控制
export const DEFAULT_PARENTAL = {
  dailyLimit: 60,
  todayUsage: 0,
  lastResetDate: new Date().toISOString().split('T')[0],
  allowedGames: Object.keys(GAMES),
  disabledGames: [],
}
