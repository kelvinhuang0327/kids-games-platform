# 幼兒網頁遊戲 - 工程師技術規格 (Technical Spec)

**文件版本**: v1.0
**更新日期**: 2025-10-27
**狀態**: Draft

---

## 1. 技術架構總覽 (Technical Architecture)

### 1.1 架構概述

#### 1.1.1 系統架構圖
```
┌─────────────────────────────────────────────────────────┐
│                     用戶端 (Client)                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │         前端應用 (Frontend Application)         │   │
│  │                                                  │   │
│  │  React 18+ / TypeScript                         │   │
│  │  ├─ React Router (SPA 路由)                    │   │
│  │  ├─ Zustand / Context API (狀態管理)          │   │
│  │  ├─ Canvas / WebGL (遊戲渲染)                 │   │
│  │  ├─ Web Audio API (音效系統)                  │   │
│  │  └─ LocalStorage / IndexedDB (本地儲存)       │   │
│  │                                                  │   │
│  └────────────────────────────────────────────────┘   │
│                                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │           UI 組件庫 (Component Library)         │   │
│  │                                                  │   │
│  │  ├─ Tailwind CSS (樣式框架)                   │   │
│  │  ├─ Framer Motion (動畫)                      │   │
│  │  └─ Radix UI (無障礙組件基礎)                 │   │
│  │                                                  │   │
│  └────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 靜態資源伺服器 (Optional)                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Nginx / Vercel / Netlify / GitHub Pages               │
│  ├─ HTTPS 加密                                          │
│  ├─ Gzip / Brotli 壓縮                                 │
│  ├─ CDN 加速 (圖片、音效)                              │
│  └─ Cache 策略                                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### 1.1.2 技術棧決策

| 層級 | 技術選擇 | 理由 |
|------|----------|------|
| **前端框架** | React 18+ | 生態系統成熟、組件化開發、豐富的兒童遊戲案例 |
| **語言** | TypeScript | 型別安全、減少運行時錯誤、提升維護性 |
| **狀態管理** | Zustand | 輕量、簡單、適合中小型專案 |
| **路由** | React Router v6 | 標準解決方案、支援嵌套路由 |
| **樣式** | Tailwind CSS | 快速開發、一致性、易於響應式設計 |
| **動畫** | Framer Motion | 聲明式動畫、性能佳、適合兒童互動 |
| **遊戲渲染** | HTML5 Canvas / PixiJS | 2D 渲染性能、廣泛支援 |
| **音效** | Howler.js | 跨瀏覽器音效、簡單 API |
| **建構工具** | Vite | 快速開發、現代化、優秀的 TypeScript 支援 |
| **測試** | Vitest + React Testing Library + Playwright | 完整測試覆蓋 |
| **程式碼品質** | ESLint + Prettier | 程式碼規範、格式化 |

### 1.2 前端技術細節

#### 1.2.1 專案結構
```
kids-games/
├── public/                      # 靜態資源
│   ├── assets/
│   │   ├── images/              # 圖片資源
│   │   │   ├── 4-6/             # 幼兒組圖片
│   │   │   └── 7-13/            # 兒童組圖片
│   │   ├── sounds/              # 音效
│   │   │   ├── sfx/             # 音效
│   │   │   ├── music/           # 背景音樂
│   │   │   └── voice/           # 語音引導
│   │   └── fonts/               # 字體檔案
│   └── favicon.ico
│
├── src/
│   ├── main.tsx                 # 應用程式入口
│   ├── App.tsx                  # 根組件
│   │
│   ├── components/              # 共用組件
│   │   ├── ui/                  # UI 基礎組件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/              # 布局組件
│   │   │   ├── Header.tsx
│   │   │   └── GameLayout.tsx
│   │   └── game/                # 遊戲共用組件
│   │       ├── GameCanvas.tsx
│   │       ├── ControlPanel.tsx
│   │       └── CompletionScreen.tsx
│   │
│   ├── pages/                   # 頁面組件
│   │   ├── Home.tsx             # 首頁
│   │   ├── GameHall.tsx         # 遊戲大廳
│   │   ├── ParentalControl.tsx  # 家長控制台
│   │   └── games/               # 各遊戲頁面
│   │       ├── Puzzle/
│   │       ├── Maze/
│   │       ├── Comic/
│   │       ├── Math/
│   │       ├── Coding/
│   │       └── EdxRecommended/
│   │
│   ├── features/                # 功能模組 (按領域組織)
│   │   ├── puzzle/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   ├── utils/
│   │   │   └── types.ts
│   │   ├── maze/
│   │   ├── audio/
│   │   │   ├── AudioManager.ts
│   │   │   └── useSound.ts
│   │   └── parental/
│   │       ├── TimeManager.ts
│   │       ├── ProgressTracker.ts
│   │       └── useParentalControl.ts
│   │
│   ├── store/                   # 全局狀態管理
│   │   ├── useGameStore.ts      # 遊戲狀態
│   │   ├── useSettingsStore.ts  # 設定狀態
│   │   └── useParentalStore.ts  # 家長控制狀態
│   │
│   ├── hooks/                   # 自訂 Hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useResponsive.ts
│   │   └── useAgeGroup.ts
│   │
│   ├── utils/                   # 工具函式
│   │   ├── storage.ts           # LocalStorage 封裝
│   │   ├── validation.ts        # 驗證工具
│   │   ├── analytics.ts         # 本地分析工具
│   │   └── constants.ts         # 常數定義
│   │
│   ├── types/                   # TypeScript 型別定義
│   │   ├── game.ts
│   │   ├── user.ts
│   │   └── index.ts
│   │
│   ├── styles/                  # 全局樣式
│   │   ├── globals.css
│   │   └── tailwind.config.js
│   │
│   └── config/                  # 配置檔案
│       ├── games.config.ts      # 遊戲配置
│       ├── age-groups.config.ts # 年齡組配置
│       └── parental.config.ts   # 家長控制配置
│
├── tests/                       # 測試檔案
│   ├── unit/                    # 單元測試
│   ├── integration/             # 整合測試
│   └── e2e/                     # E2E 測試
│
├── docs/                        # 文件
│   └── specs/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

#### 1.2.2 核心技術配置

**TypeScript 配置 (tsconfig.json)**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@features/*": ["./src/features/*"],
      "@utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Vite 配置 (vite.config.ts)**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['framer-motion'],
          'audio': ['howler'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

### 1.3 響應式與設備支援

#### 1.3.1 響應式斷點
```typescript
// src/config/responsive.config.ts
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.tablet - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
} as const
```

#### 1.3.2 支援的瀏覽器
| 瀏覽器 | 最低版本 | 備註 |
|--------|----------|------|
| Chrome | 90+ | 主要支援 |
| Safari | 14+ | iOS 設備支援 |
| Firefox | 88+ | 次要支援 |
| Edge | 90+ | Chromium 基礎 |

#### 1.3.3 設備支援策略
- **桌面**: 完整功能
- **平板**: 完整功能，觸控優化
- **手機**: 基礎支援，建議使用平板或桌面

---

## 2. 主要模組詳細設計 (Module Design)

### 2.1 年齡組切換與驗證模組

#### 2.1.1 年齡組配置
```typescript
// src/config/age-groups.config.ts
export type AgeGroup = '4-6' | '7-13'

export interface AgeGroupConfig {
  id: AgeGroup
  name: string
  displayName: string
  description: string
  theme: {
    primaryColor: string
    bgColor: string
    fontFamily: string
  }
  games: string[]
  features: {
    voiceGuidance: boolean
    timer: boolean
    scoring: boolean
    achievements: boolean
  }
}

export const AGE_GROUPS: Record<AgeGroup, AgeGroupConfig> = {
  '4-6': {
    id: '4-6',
    name: 'toddler',
    displayName: '寶寶樂園',
    description: '適合 4-6 歲幼兒',
    theme: {
      primaryColor: '#FF6B9D',
      bgColor: '#FFF9E6',
      fontFamily: 'Noto Sans TC, sans-serif',
    },
    games: ['puzzle', 'maze', 'comic'],
    features: {
      voiceGuidance: true,
      timer: false,
      scoring: false,
      achievements: false,
    },
  },
  '7-13': {
    id: '7-13',
    name: 'kids',
    displayName: '小學天地',
    description: '適合 7-13 歲兒童',
    theme: {
      primaryColor: '#4A90E2',
      bgColor: '#F5F8FF',
      fontFamily: 'Noto Sans TC, sans-serif',
    },
    games: ['puzzle', 'maze', 'comic', 'math', 'coding', 'edx'],
    features: {
      voiceGuidance: false,
      timer: true,
      scoring: true,
      achievements: true,
    },
  },
}
```

#### 2.1.2 年齡組狀態管理
```typescript
// src/store/useAgeGroupStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AgeGroup } from '@/config/age-groups.config'

interface AgeGroupState {
  currentAgeGroup: AgeGroup | null
  setAgeGroup: (ageGroup: AgeGroup) => void
  resetAgeGroup: () => void
}

export const useAgeGroupStore = create<AgeGroupState>()(
  persist(
    (set) => ({
      currentAgeGroup: null,
      setAgeGroup: (ageGroup) => set({ currentAgeGroup: ageGroup }),
      resetAgeGroup: () => set({ currentAgeGroup: null }),
    }),
    {
      name: 'age-group-storage',
    }
  )
)
```

#### 2.1.3 年齡驗證 Hook
```typescript
// src/hooks/useAgeVerification.ts
import { useState, useCallback } from 'react'

export const useAgeVerification = () => {
  const [isVerified, setIsVerified] = useState(false)

  const verifyAge = useCallback(async (answer: number): Promise<boolean> => {
    // 簡單數學題驗證 (例: 3 + 5 = ?)
    // 實際應用中可動態生成問題
    const correctAnswer = 8
    const verified = answer === correctAnswer
    setIsVerified(verified)
    return verified
  }, [])

  return { isVerified, verifyAge }
}
```

### 2.2 遊戲模組架構

#### 2.2.1 遊戲基礎介面
```typescript
// src/types/game.ts
export interface GameConfig {
  id: string
  name: string
  displayName: string
  description: string
  icon: string
  ageGroups: AgeGroup[]
  difficulty: 'easy' | 'medium' | 'hard'
  category: 'puzzle' | 'logic' | 'creative' | 'educational'
}

export interface GameState {
  isPlaying: boolean
  isPaused: boolean
  isCompleted: boolean
  startTime: number | null
  endTime: number | null
  score: number
  progress: number
}

export interface GameProps {
  config: GameConfig
  onComplete: (result: GameResult) => void
  onExit: () => void
}

export interface GameResult {
  gameId: string
  completed: boolean
  score: number
  duration: number // 毫秒
  accuracy?: number
  attempts?: number
}
```

#### 2.2.2 拼圖遊戲實作範例
```typescript
// src/features/puzzle/components/PuzzleGame.tsx
import { useState, useEffect, useCallback } from 'react'
import { GameCanvas } from '@/components/game/GameCanvas'
import { ControlPanel } from '@/components/game/ControlPanel'
import { usePuzzleLogic } from '../hooks/usePuzzleLogic'
import type { GameProps } from '@/types/game'

export const PuzzleGame: React.FC<GameProps> = ({ config, onComplete, onExit }) => {
  const {
    pieces,
    placedPieces,
    progress,
    isCompleted,
    handlePieceDrop,
    reset,
  } = usePuzzleLogic(config)

  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (isCompleted) {
      const duration = Date.now() - startTime
      onComplete({
        gameId: config.id,
        completed: true,
        score: 100,
        duration,
      })
    }
  }, [isCompleted, startTime, config.id, onComplete])

  return (
    <div className="puzzle-game">
      <ControlPanel
        progress={progress}
        onPause={() => {}}
        onReset={reset}
        onExit={onExit}
      />
      <GameCanvas
        pieces={pieces}
        placedPieces={placedPieces}
        onPieceDrop={handlePieceDrop}
      />
    </div>
  )
}
```

#### 2.2.3 拼圖遊戲邏輯 Hook
```typescript
// src/features/puzzle/hooks/usePuzzleLogic.ts
import { useState, useCallback, useMemo } from 'react'
import type { GameConfig } from '@/types/game'

interface PuzzlePiece {
  id: string
  imageUrl: string
  correctPosition: { x: number; y: number }
  currentPosition: { x: number; y: number } | null
}

export const usePuzzleLogic = (config: GameConfig) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [placedPieces, setPlacedPieces] = useState<Set<string>>(new Set())

  const progress = useMemo(() => {
    return (placedPieces.size / pieces.length) * 100
  }, [placedPieces.size, pieces.length])

  const isCompleted = useMemo(() => {
    return placedPieces.size === pieces.length
  }, [placedPieces.size, pieces.length])

  const handlePieceDrop = useCallback((pieceId: string, position: { x: number; y: number }) => {
    const piece = pieces.find((p) => p.id === pieceId)
    if (!piece) return

    const isCorrect =
      Math.abs(position.x - piece.correctPosition.x) < 20 &&
      Math.abs(position.y - piece.correctPosition.y) < 20

    if (isCorrect) {
      setPlacedPieces((prev) => new Set(prev).add(pieceId))
      // 播放成功音效
    } else {
      // 播放錯誤音效
    }
  }, [pieces])

  const reset = useCallback(() => {
    setPlacedPieces(new Set())
    // 重新洗牌拼圖塊位置
  }, [])

  return {
    pieces,
    placedPieces,
    progress,
    isCompleted,
    handlePieceDrop,
    reset,
  }
}
```

### 2.3 音效系統

#### 2.3.1 音效管理器
```typescript
// src/features/audio/AudioManager.ts
import { Howl, Howler } from 'howler'

type SoundType = 'click' | 'success' | 'error' | 'complete' | 'bgm'

interface SoundConfig {
  src: string
  volume?: number
  loop?: boolean
}

class AudioManager {
  private sounds: Map<SoundType, Howl> = new Map()
  private isMuted: boolean = false

  constructor() {
    this.loadSounds()
  }

  private loadSounds() {
    const soundConfigs: Record<SoundType, SoundConfig> = {
      click: { src: '/assets/sounds/sfx/click.mp3', volume: 0.5 },
      success: { src: '/assets/sounds/sfx/success.mp3', volume: 0.7 },
      error: { src: '/assets/sounds/sfx/error.mp3', volume: 0.5 },
      complete: { src: '/assets/sounds/sfx/complete.mp3', volume: 0.8 },
      bgm: { src: '/assets/sounds/music/bgm.mp3', volume: 0.3, loop: true },
    }

    Object.entries(soundConfigs).forEach(([type, config]) => {
      const sound = new Howl({
        src: [config.src],
        volume: config.volume,
        loop: config.loop,
      })
      this.sounds.set(type as SoundType, sound)
    })
  }

  play(type: SoundType) {
    if (this.isMuted) return
    const sound = this.sounds.get(type)
    sound?.play()
  }

  stop(type: SoundType) {
    const sound = this.sounds.get(type)
    sound?.stop()
  }

  setVolume(type: SoundType, volume: number) {
    const sound = this.sounds.get(type)
    sound?.volume(volume)
  }

  mute() {
    this.isMuted = true
    Howler.mute(true)
  }

  unmute() {
    this.isMuted = false
    Howler.mute(false)
  }

  toggleMute() {
    this.isMuted ? this.unmute() : this.mute()
  }
}

export const audioManager = new AudioManager()
```

#### 2.3.2 音效 Hook
```typescript
// src/features/audio/useSound.ts
import { useCallback } from 'react'
import { audioManager } from './AudioManager'
import type { SoundType } from './AudioManager'

export const useSound = () => {
  const play = useCallback((type: SoundType) => {
    audioManager.play(type)
  }, [])

  const stop = useCallback((type: SoundType) => {
    audioManager.stop(type)
  }, [])

  const toggleMute = useCallback(() => {
    audioManager.toggleMute()
  }, [])

  return { play, stop, toggleMute }
}
```

### 2.4 語音引導系統

#### 2.4.1 語音管理器
```typescript
// src/features/audio/VoiceManager.ts
import { Howl } from 'howler'

type VoiceKey = 'welcome' | 'choose_game' | 'well_done' | 'try_again'

class VoiceManager {
  private voices: Map<VoiceKey, Howl> = new Map()
  private currentVoice: Howl | null = null

  constructor() {
    this.loadVoices()
  }

  private loadVoices() {
    const voiceUrls: Record<VoiceKey, string> = {
      welcome: '/assets/sounds/voice/welcome.mp3',
      choose_game: '/assets/sounds/voice/choose_game.mp3',
      well_done: '/assets/sounds/voice/well_done.mp3',
      try_again: '/assets/sounds/voice/try_again.mp3',
    }

    Object.entries(voiceUrls).forEach(([key, url]) => {
      const voice = new Howl({ src: [url], volume: 0.8 })
      this.voices.set(key as VoiceKey, voice)
    })
  }

  speak(key: VoiceKey) {
    // 停止目前播放的語音
    this.currentVoice?.stop()

    const voice = this.voices.get(key)
    if (voice) {
      this.currentVoice = voice
      voice.play()
    }
  }

  stop() {
    this.currentVoice?.stop()
    this.currentVoice = null
  }
}

export const voiceManager = new VoiceManager()
```

### 2.5 動畫系統

#### 2.5.1 動畫配置
```typescript
// src/config/animations.config.ts
import type { Variants } from 'framer-motion'

export const FADE_IN: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

export const SCALE_IN: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  },
}

export const CELEBRATION: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: [0, 1.2, 1],
    rotate: [0, 10, -10, 0],
    transition: { duration: 0.6 },
  },
}

export const BOUNCE: Variants = {
  tap: { scale: 0.95 },
  hover: { scale: 1.05 },
}
```

#### 2.5.2 完成動畫組件
```typescript
// src/components/game/CompletionScreen.tsx
import { motion } from 'framer-motion'
import { CELEBRATION } from '@/config/animations.config'
import Confetti from 'react-confetti'

interface CompletionScreenProps {
  onReplay: () => void
  onChooseAnother: () => void
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  onReplay,
  onChooseAnother,
}) => {
  return (
    <motion.div
      className="completion-screen"
      initial="hidden"
      animate="visible"
      variants={CELEBRATION}
    >
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <h1 className="text-6xl">🎉 太棒了！🎉</h1>
      <div className="buttons">
        <button onClick={onReplay}>再玩一次</button>
        <button onClick={onChooseAnother}>換遊戲玩</button>
      </div>
    </motion.div>
  )
}
```

---

## 3. 資料與安全 (Data & Security)

### 3.1 本地儲存架構

#### 3.1.1 儲存結構
```typescript
// src/utils/storage.ts
export interface StorageSchema {
  // 用戶設定
  settings: {
    ageGroup: AgeGroup | null
    soundEnabled: boolean
    musicEnabled: boolean
    voiceEnabled: boolean
  }
  // 遊戲進度
  progress: {
    [gameId: string]: {
      completed: boolean
      bestScore: number
      bestTime: number
      attempts: number
      lastPlayed: string // ISO date
    }
  }
  // 家長控制
  parental: {
    dailyLimit: number // 分鐘
    todayUsage: number // 分鐘
    lastResetDate: string // ISO date
    allowedGames: string[]
    disabledGames: string[]
  }
  // 統計資料
  analytics: {
    totalPlayTime: number // 分鐘
    gamesPlayed: number
    favoriteGames: string[]
  }
}

class LocalStorage {
  private prefix = 'kids_games_'

  get<K extends keyof StorageSchema>(key: K): StorageSchema[K] | null {
    try {
      const item = localStorage.getItem(this.prefix + key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  }

  set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value))
    } catch (error) {
      console.error('Storage set error:', error)
    }
  }

  remove<K extends keyof StorageSchema>(key: K): void {
    localStorage.removeItem(this.prefix + key)
  }

  clear(): void {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    })
  }
}

export const storage = new LocalStorage()
```

#### 3.1.2 進度追蹤系統
```typescript
// src/features/parental/ProgressTracker.ts
import { storage } from '@/utils/storage'
import type { GameResult } from '@/types/game'

class ProgressTracker {
  trackGameCompletion(result: GameResult) {
    const progress = storage.get('progress') || {}
    const gameProgress = progress[result.gameId] || {
      completed: false,
      bestScore: 0,
      bestTime: Infinity,
      attempts: 0,
      lastPlayed: new Date().toISOString(),
    }

    const updated = {
      ...gameProgress,
      completed: result.completed || gameProgress.completed,
      bestScore: Math.max(result.score, gameProgress.bestScore),
      bestTime: Math.min(result.duration, gameProgress.bestTime),
      attempts: gameProgress.attempts + 1,
      lastPlayed: new Date().toISOString(),
    }

    progress[result.gameId] = updated
    storage.set('progress', progress)

    this.updateAnalytics(result)
  }

  private updateAnalytics(result: GameResult) {
    const analytics = storage.get('analytics') || {
      totalPlayTime: 0,
      gamesPlayed: 0,
      favoriteGames: [],
    }

    analytics.totalPlayTime += Math.round(result.duration / 60000) // 轉換為分鐘
    analytics.gamesPlayed += 1

    storage.set('analytics', analytics)
  }

  getGameProgress(gameId: string) {
    const progress = storage.get('progress') || {}
    return progress[gameId] || null
  }

  getAllProgress() {
    return storage.get('progress') || {}
  }
}

export const progressTracker = new ProgressTracker()
```

### 3.2 時間管理系統

#### 3.2.1 時間追蹤器
```typescript
// src/features/parental/TimeManager.ts
import { storage } from '@/utils/storage'

class TimeManager {
  private sessionStart: number | null = null
  private checkInterval: NodeJS.Timeout | null = null

  startSession() {
    this.sessionStart = Date.now()
    this.resetIfNewDay()
    this.startMonitoring()
  }

  endSession() {
    if (this.sessionStart) {
      const duration = Math.round((Date.now() - this.sessionStart) / 60000)
      this.addUsage(duration)
      this.sessionStart = null
    }
    this.stopMonitoring()
  }

  private startMonitoring() {
    // 每分鐘檢查一次
    this.checkInterval = setInterval(() => {
      this.checkTimeLimit()
    }, 60000)
  }

  private stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  private resetIfNewDay() {
    const parental = storage.get('parental')
    if (!parental) return

    const today = new Date().toISOString().split('T')[0]
    if (parental.lastResetDate !== today) {
      parental.todayUsage = 0
      parental.lastResetDate = today
      storage.set('parental', parental)
    }
  }

  private addUsage(minutes: number) {
    const parental = storage.get('parental')
    if (!parental) return

    parental.todayUsage += minutes
    storage.set('parental', parental)
  }

  private checkTimeLimit() {
    const parental = storage.get('parental')
    if (!parental) return

    if (parental.todayUsage >= parental.dailyLimit) {
      this.onTimeLimitReached()
    }
  }

  private onTimeLimitReached() {
    // 顯示溫和提醒
    alert('今天的遊戲時間已經用完囉！明天再來玩吧～')
    // 導向首頁或鎖定介面
    window.location.href = '/'
  }

  getRemainingTime(): number {
    const parental = storage.get('parental')
    if (!parental) return Infinity

    return Math.max(0, parental.dailyLimit - parental.todayUsage)
  }

  getTodayUsage(): number {
    const parental = storage.get('parental')
    return parental?.todayUsage || 0
  }
}

export const timeManager = new TimeManager()
```

### 3.3 安全與隱私機制

#### 3.3.1 內容安全政策 (CSP)
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy"
      content="
        default-src 'self';
        script-src 'self' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        font-src 'self' data:;
        media-src 'self' blob:;
        connect-src 'self';
        frame-src 'none';
        object-src 'none';
      ">
```

#### 3.3.2 外部連結檢查
```typescript
// src/utils/validation.ts
const ALLOWED_DOMAINS = [
  'edx.org',
  'khanacademy.org',
  // 其他經審核的教育網站
]

export function isAllowedExternalLink(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ALLOWED_DOMAINS.some(domain => urlObj.hostname.endsWith(domain))
  } catch {
    return false
  }
}

export function sanitizeUrl(url: string): string | null {
  if (isAllowedExternalLink(url)) {
    return url
  }
  console.warn('Blocked unauthorized external link:', url)
  return null
}
```

#### 3.3.3 資料加密 (選用)
```typescript
// src/utils/encryption.ts
// 針對敏感設定 (如家長密碼) 的簡單加密
// 注意: 前端加密無法防止有心人士，主要目的是防止兒童誤觸

export function simpleEncrypt(text: string): string {
  // 簡單的 Base64 編碼 + 字串反轉
  const encoded = btoa(text)
  return encoded.split('').reverse().join('')
}

export function simpleDecrypt(encrypted: string): string {
  try {
    const reversed = encrypted.split('').reverse().join('')
    return atob(reversed)
  } catch {
    return ''
  }
}
```

---

## 4. 部署與性能 (Deployment & Performance)

### 4.1 建構與部署

#### 4.1.1 建構指令
```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "type-check": "tsc --noEmit"
  }
}
```

#### 4.1.2 CI/CD 流程 (GitHub Actions)
```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist
      # 部署到 Vercel / Netlify / GitHub Pages
      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 4.2 性能優化

#### 4.2.1 性能指標目標
| 指標 | 目標 | 備註 |
|------|------|------|
| **FCP** (First Contentful Paint) | < 1.5s | 首次內容繪製 |
| **LCP** (Largest Contentful Paint) | < 2.5s | 最大內容繪製 |
| **FID** (First Input Delay) | < 100ms | 首次輸入延遲 |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 累積版面配置位移 |
| **TTI** (Time to Interactive) | < 3.5s | 可互動時間 |

#### 4.2.2 優化策略

**1. 程式碼分割**
```typescript
// src/App.tsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const GameHall = lazy(() => import('./pages/GameHall'))
const ParentalControl = lazy(() => import('./pages/ParentalControl'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hall/:ageGroup" element={<GameHall />} />
          <Route path="/parental" element={<ParentalControl />} />
          {/* 各遊戲路由 */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

**2. 圖片優化**
```typescript
// src/utils/imageLoader.ts
export function getOptimizedImageUrl(
  src: string,
  width: number,
  format: 'webp' | 'jpg' = 'webp'
): string {
  // 使用 CDN 或 Image Service 進行即時優化
  return `${src}?w=${width}&fm=${format}&q=85`
}

// 使用範例
<img
  src={getOptimizedImageUrl('/assets/images/puzzle.png', 400)}
  alt="拼圖"
  loading="lazy"
/>
```

**3. 資源預載**
```html
<!-- index.html -->
<head>
  <!-- DNS 預解析 -->
  <link rel="dns-prefetch" href="//cdn.example.com">

  <!-- 預連接 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">

  <!-- 預載關鍵資源 -->
  <link rel="preload" href="/assets/sounds/sfx/click.mp3" as="audio">
  <link rel="preload" href="/assets/fonts/NotoSansTC-Bold.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

**4. 快取策略**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // 檔案名稱加上 hash，利於長期快取
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
})
```

### 4.3 多端測試

#### 4.3.1 測試裝置清單
**桌面**:
- Windows 10/11 + Chrome
- macOS + Safari
- Linux + Firefox

**平板**:
- iPad (Safari)
- Android 平板 (Chrome)

**手機** (基礎測試):
- iPhone (Safari)
- Android (Chrome)

#### 4.3.2 測試工具
- **本地測試**: Chrome DevTools Device Mode
- **雲端測試**: BrowserStack / LambdaTest
- **自動化**: Playwright (跨瀏覽器測試)

#### 4.3.3 測試腳本範例
```typescript
// tests/e2e/responsive.spec.ts
import { test, expect, devices } from '@playwright/test'

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Desktop', device: devices['Desktop Chrome'] },
    { name: 'iPad', device: devices['iPad Pro'] },
    { name: 'iPhone', device: devices['iPhone 13'] },
  ]

  viewports.forEach(({ name, device }) => {
    test(`Home page renders correctly on ${name}`, async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('.age-group-button')).toHaveCount(2)
      // 檢查按鈕大小是否符合最小觸控標準
      const button = page.locator('.age-group-button').first()
      const box = await button.boundingBox()
      expect(box?.width).toBeGreaterThan(44)
      expect(box?.height).toBeGreaterThan(44)
    })
  })
})
```

### 4.4 監控與日誌

#### 4.4.1 錯誤追蹤
```typescript
// src/utils/errorHandler.ts
class ErrorHandler {
  init() {
    window.addEventListener('error', this.handleError)
    window.addEventListener('unhandledrejection', this.handleRejection)
  }

  private handleError = (event: ErrorEvent) => {
    console.error('Global error:', event.error)
    // 記錄到本地或發送到錯誤追蹤服務 (如 Sentry)
    this.logError({
      type: 'error',
      message: event.message,
      stack: event.error?.stack,
      url: event.filename,
      line: event.lineno,
      col: event.colno,
    })
  }

  private handleRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason)
    this.logError({
      type: 'unhandledRejection',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
    })
  }

  private logError(error: any) {
    // 本地記錄 (不上傳雲端，符合隱私政策)
    const errors = JSON.parse(localStorage.getItem('error_logs') || '[]')
    errors.push({ ...error, timestamp: new Date().toISOString() })
    // 只保留最近 50 筆
    localStorage.setItem('error_logs', JSON.stringify(errors.slice(-50)))
  }
}

export const errorHandler = new ErrorHandler()
```

#### 4.4.2 性能監控
```typescript
// src/utils/performance.ts
export function measurePerformance() {
  if ('PerformanceObserver' in window) {
    // 監控 LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log('LCP:', lastEntry.startTime)
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // 監控 FID
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime)
      }
    })
    fidObserver.observe({ entryTypes: ['first-input'] })
  }
}
```

---

## 5. 開發規範與最佳實踐

### 5.1 程式碼風格

#### 5.1.1 命名規範
```typescript
// 組件名稱: PascalCase
export const GameCard: React.FC<GameCardProps> = () => {}

// 函式/變數: camelCase
const handleClick = () => {}
const isPlaying = true

// 常數: UPPER_SNAKE_CASE
const MAX_ATTEMPTS = 3
const DEFAULT_TIMEOUT = 5000

// 型別/介面: PascalCase
interface GameConfig {}
type AgeGroup = '4-6' | '7-13'

// 檔案名稱: kebab-case
// game-card.tsx, use-game-logic.ts
```

#### 5.1.2 組件結構
```typescript
// 推薦的組件結構
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSound } from '@/features/audio/useSound'
import type { GameProps } from '@/types/game'

// 1. 型別定義
interface ComponentProps extends GameProps {
  customProp?: string
}

// 2. 組件實作
export const Component: React.FC<ComponentProps> = ({
  config,
  onComplete,
  onExit,
  customProp
}) => {
  // 3. Hooks
  const { play } = useSound()
  const [state, setState] = useState(false)

  // 4. Effects
  useEffect(() => {
    // ...
  }, [])

  // 5. 事件處理
  const handleClick = () => {
    play('click')
    setState(true)
  }

  // 6. 渲染
  return (
    <motion.div>
      {/* JSX */}
    </motion.div>
  )
}
```

### 5.2 效能最佳實踐

#### 5.2.1 避免不必要的重新渲染
```typescript
import { memo, useCallback, useMemo } from 'react'

// 使用 memo 包裝純組件
export const GameCard = memo<GameCardProps>(({ game }) => {
  return <div>{game.name}</div>
})

// 使用 useCallback 穩定函式引用
const Parent = () => {
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  return <GameCard onClick={handleClick} />
}

// 使用 useMemo 快取計算結果
const ExpensiveComponent = ({ items }) => {
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0)
  }, [items])

  return <div>{total}</div>
}
```

#### 5.2.2 懶加載與程式碼分割
```typescript
// 路由層級的程式碼分割
const GamePage = lazy(() => import('./pages/GamePage'))

// 組件層級的懶加載
const HeavyComponent = lazy(() => import('./components/HeavyComponent'))

// 條件載入
function App() {
  const [showHeavy, setShowHeavy] = useState(false)

  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>載入</button>
      {showHeavy && (
        <Suspense fallback={<Loading />}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  )
}
```

### 5.3 無障礙開發

#### 5.3.1 語意化 HTML
```tsx
// 良好的語意化結構
<nav aria-label="主選單">
  <ul>
    <li><a href="/">首頁</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>遊戲標題</h1>
    <section aria-labelledby="game-description">
      <h2 id="game-description">遊戲說明</h2>
      <p>...</p>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2025 幼兒遊戲平台</p>
</footer>
```

#### 5.3.2 鍵盤導航
```tsx
// 確保所有互動元素可透過鍵盤操作
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
  aria-label="開始遊戲"
>
  開始
</button>

// 自訂 Tab 順序
<div tabIndex={0} role="button" aria-pressed={isActive}>
  自訂按鈕
</div>
```

#### 5.3.3 ARIA 屬性
```tsx
// 進度指示
<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="遊戲進度"
>
  {progress}%
</div>

// 即時更新通知
<div role="status" aria-live="polite">
  {message}
</div>

// 模態框
<dialog
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">標題</h2>
  <button aria-label="關閉">×</button>
</dialog>
```

---

## 6. 附錄

### 6.1 技術選型比較

#### 6.1.1 前端框架比較
| 框架 | 優點 | 缺點 | 選擇原因 |
|------|------|------|----------|
| React | 生態豐富、社群大、學習資源多 | 需要額外狀態管理 | ✅ 選用 |
| Vue | 易學習、完整解決方案 | 生態較小、兒童遊戲案例較少 | - |
| Svelte | 性能佳、打包體積小 | 生態較新、第三方庫較少 | - |

#### 6.1.2 狀態管理比較
| 方案 | 優點 | 缺點 | 選擇原因 |
|------|------|------|----------|
| Zustand | 輕量、簡單、TypeScript 友善 | 功能相對精簡 | ✅ 選用 |
| Redux Toolkit | 功能完整、工具豐富 | 學習曲線陡、程式碼量多 | - |
| Context API | React 內建、無需額外依賴 | 性能問題、不適合複雜狀態 | - |

### 6.2 外部資源

#### 6.2.1 字體
```css
/* src/styles/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap');

body {
  font-family: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

#### 6.2.2 圖示
- [Lucide Icons](https://lucide.dev/) - 現代化、可客製化的 SVG 圖示庫
- [Heroicons](https://heroicons.com/) - Tailwind CSS 團隊出品

### 6.3 環境變數
```env
# .env.example
VITE_APP_NAME=幼兒遊戲樂園
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_CDN_URL=https://cdn.example.com
```

### 6.4 版本歷史
| 版本 | 日期 | 修改者 | 說明 |
|------|------|--------|------|
| v1.0 | 2025-10-27 | 開發團隊 | 初版發布 |

---

**文件結束**
