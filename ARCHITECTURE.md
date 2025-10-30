# 專案架構說明

## Token 優化設計原則

本專案採用以下策略來減少 AI token 使用量：

### 1. 精簡的技術棧
- **React 18**: 核心 UI 框架
- **Zustand**: 輕量級狀態管理（比 Redux 簡單 80%）
- **Framer Motion**: 動畫（僅在需要時使用）
- **Tailwind CSS**: Utility-first CSS（減少自訂 CSS）
- **LocalStorage**: 純前端，無後端依賴

### 2. 模組化設計

```
清晰的職責分離：
- types/       → 所有類型定義集中管理
- utils/       → 純函式工具，無依賴
- store/       → 狀態管理，最小化
- components/  → 可重用組件
- pages/       → 頁面級組件
```

### 3. 代碼復用策略

**基礎組件**（高復用率）:
- `Button`: 統一按鈕樣式，減少重複代碼
- `Card`: 統一卡片樣式
- 統一動畫配置

**狀態管理**（集中化）:
- `useSettingsStore`: 全局設定
- `useGameStore`: 遊戲進度

### 4. 類型安全

使用 TypeScript 嚴格模式：
- 減少運行時錯誤
- 自動補全提升開發效率
- 重構更安全

## 核心架構

### 數據流

```
用戶操作
    ↓
React 組件
    ↓
Zustand Store (狀態更新)
    ↓
LocalStorage (持久化)
    ↓
UI 重新渲染
```

### 狀態管理策略

```typescript
// 設定狀態（全局）
useSettingsStore
├─ ageGroup: 當前年齡組
├─ soundEnabled: 音效開關
└─ musicEnabled: 音樂開關

// 遊戲狀態（全局）
useGameStore
├─ progress: 各遊戲進度
└─ saveResult(): 保存遊戲結果
```

### 路由設計

```
/                    → Home (年齡組選擇)
/hall/:ageGroup      → GameHall (遊戲大廳)
/game/:gameId        → 各遊戲頁面
/parental            → ParentalControl (家長控制台)
```

## 文件組織策略

### 按功能分組（Feature-based）

```
src/
├── features/
│   ├── puzzle/          # 拼圖遊戲相關
│   │   ├── hooks/
│   │   ├── components/
│   │   └── utils/
│   ├── audio/           # 音效系統
│   └── parental/        # 家長控制
```

### 按類型分組（Type-based）

```
src/
├── components/          # 共用組件
├── pages/              # 頁面
├── store/              # 狀態
├── utils/              # 工具
└── types/              # 類型
```

**本專案採用混合策略**：
- 共用部分按類型分組
- 獨立功能按功能分組

## 性能優化

### 1. 代碼分割

```typescript
// 路由層級懶加載（未來可添加）
const PuzzlePage = lazy(() => import('./pages/games/puzzle/PuzzlePage'))

// 條件渲染減少初始載入
{completed && <CompletionScreen />}
```

### 2. 組件優化

```typescript
// 使用 motion 組件時僅在需要動畫時使用
<motion.div> // 有動畫
<div>        // 無動畫需求時使用普通 div
```

### 3. 狀態最小化

```typescript
// ❌ 避免：過多的狀態
const [a, setA] = useState()
const [b, setB] = useState()
const [c, setC] = useState()

// ✅ 推薦：計算得出的值
const c = a + b
```

## 擴展指南

### 添加新遊戲（3步驟）

**1. 配置遊戲**
```typescript
// src/utils/constants.ts
export const GAMES = {
  newGame: {
    id: 'newGame',
    name: 'newGame',
    displayName: '新遊戲',
    description: '描述',
    icon: '🎮',
    ageGroups: ['4-6', '7-13'],
    difficulty: 'easy',
  },
}
```

**2. 創建遊戲組件**
```typescript
// src/pages/games/NewGame.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/store/useGameStore'

export const NewGame = () => {
  const navigate = useNavigate()
  const { saveResult } = useGameStore()

  // 遊戲邏輯...

  return <div>遊戲內容</div>
}
```

**3. 添加路由**
```typescript
// src/App.tsx
<Route path="/game/newGame" element={<NewGame />} />
```

### 添加新功能到家長控制台

**1. 擴展類型**
```typescript
// src/types/index.ts
export interface ParentalControl {
  // 現有欄位...
  newFeature: string  // 新功能
}
```

**2. 更新預設值**
```typescript
// src/utils/constants.ts
export const DEFAULT_PARENTAL = {
  // ...
  newFeature: 'default',
}
```

**3. 更新 UI**
```typescript
// src/pages/ParentalControl.tsx
// 添加新的區塊顯示功能
```

## 測試策略（未來）

### 單元測試
```typescript
// Button.test.tsx
import { render, fireEvent } from '@testing-library/react'
import { Button } from './Button'

test('calls onClick when clicked', () => {
  const handleClick = jest.fn()
  const { getByText } = render(<Button onClick={handleClick}>Click</Button>)
  fireEvent.click(getByText('Click'))
  expect(handleClick).toHaveBeenCalled()
})
```

### 整合測試
```typescript
// GameFlow.test.tsx
test('complete game flow', () => {
  // 1. 選擇年齡組
  // 2. 選擇遊戲
  // 3. 完成遊戲
  // 4. 檢查進度保存
})
```

## 最佳實踐

### 1. 命名規範
```typescript
// 組件: PascalCase
export const GameCard = () => {}

// 函式/變數: camelCase
const handleClick = () => {}

// 常數: UPPER_SNAKE_CASE
const MAX_ATTEMPTS = 3

// 類型: PascalCase
interface GameConfig {}
```

### 2. 導入順序
```typescript
// 1. React 相關
import { useState } from 'react'

// 2. 第三方庫
import { motion } from 'framer-motion'

// 3. 內部導入（使用 @ alias）
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/useGameStore'

// 4. 類型導入
import type { GameConfig } from '@/types'
```

### 3. 組件結構
```typescript
// 1. Imports
import { ... }

// 2. Types
interface Props {}

// 3. Component
export const Component = (props: Props) => {
  // 4. Hooks
  const store = useStore()
  const [state, setState] = useState()

  // 5. Handlers
  const handleClick = () => {}

  // 6. Effects
  useEffect(() => {}, [])

  // 7. Render
  return <div>...</div>
}
```

## 安全考量

### 1. 本地儲存
- 無敏感資料上傳
- 使用 LocalStorage 前綴避免衝突
- 清除功能防止資料洩漏

### 2. 家長驗證
- 簡單數學題防止兒童誤入
- 可擴展為更複雜的驗證

### 3. 內容安全
- CSP 設定（index.html）
- 無外部腳本
- 無第三方追蹤

## 部署考量

### 環境變數（未來可添加）
```bash
VITE_API_URL=https://api.example.com
VITE_ENABLE_ANALYTICS=false
```

### 建構優化
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'animation': ['framer-motion'],
      },
    },
  },
}
```

## 總結

本專案透過以下方式優化 token 使用：

1. ✅ **精簡技術棧**: 僅使用必要的工具
2. ✅ **清晰架構**: 易於理解和擴展
3. ✅ **代碼復用**: 共用組件和邏輯
4. ✅ **類型安全**: 減少錯誤和重構成本
5. ✅ **模組化**: 功能獨立，易於維護

目標：**用最少的代碼實現最多的功能**
