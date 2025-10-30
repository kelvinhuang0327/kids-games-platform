# 快速開始指南

## 安裝依賴

```bash
npm install
```

## 啟動開發伺服器

```bash
npm run dev
```

瀏覽器會自動開啟 `http://localhost:3000`

## 專案結構

```
src/
├── components/          # UI 組件
│   ├── ui/             # 基礎 UI 組件（Button, Card）
│   ├── layout/         # 布局組件
│   └── game/           # 遊戲共用組件
├── pages/              # 頁面
│   ├── Home.tsx        # 首頁（年齡組選擇）
│   ├── GameHall.tsx    # 遊戲大廳
│   ├── ParentalControl.tsx  # 家長控制台
│   └── games/          # 各遊戲頁面
│       └── puzzle/     # 拼圖遊戲
├── store/              # Zustand 狀態管理
│   ├── useSettingsStore.ts   # 設定狀態
│   └── useGameStore.ts       # 遊戲進度
├── types/              # TypeScript 類型定義
├── utils/              # 工具函式
│   ├── constants.ts    # 常數配置
│   └── storage.ts      # LocalStorage 封裝
└── styles/             # 全局樣式
```

## 功能特色

### 已實現功能

✅ 首頁年齡組選擇（4-6歲 / 7-13歲）
✅ 分齡遊戲大廳
✅ 拼圖遊戲示例（簡化版）
✅ 家長控制台
  - 驗證機制
  - 遊戲統計
  - 進度追蹤
  - 資料管理
✅ 本地儲存（LocalStorage）
✅ 響應式設計
✅ 動畫效果（Framer Motion）

### Token 優化設計

本專案採用以下策略減少 token 使用：

1. **精簡架構**: 僅使用必要的庫和工具
2. **Zustand**: 比 Redux 更輕量的狀態管理
3. **功能模組化**: 清晰的文件分離
4. **TypeScript**: 型別安全，減少錯誤
5. **共用組件**: Button, Card 等可重用組件

## 開發指南

### 添加新遊戲

1. 在 `src/utils/constants.ts` 的 `GAMES` 中添加遊戲配置
2. 在 `src/pages/games/` 創建遊戲組件
3. 在 `src/App.tsx` 添加路由

範例：
```tsx
// 1. 添加遊戲配置
export const GAMES = {
  // ...
  newGame: {
    id: 'newGame',
    name: 'newGame',
    displayName: '新遊戲',
    description: '描述',
    icon: '🎮',
    ageGroups: ['7-13'],
    difficulty: 'medium',
  },
}

// 2. 創建遊戲組件
// src/pages/games/NewGame.tsx
export const NewGame = () => {
  return <div>新遊戲</div>
}

// 3. 添加路由
<Route path="/game/newGame" element={<NewGame />} />
```

### 修改年齡組配置

編輯 `src/utils/constants.ts` 中的 `AGE_GROUPS`:

```ts
export const AGE_GROUPS = {
  '4-6': {
    name: '寶寶樂園',
    color: '#FF6B9D',  // 主色
    bg: '#FFF9E6',     // 背景色
  },
  // ...
}
```

### 擴展家長控制功能

編輯 `src/types/index.ts` 中的 `ParentalControl` 介面，
然後更新 `src/pages/ParentalControl.tsx`

## 測試

```bash
# 單元測試
npm run test

# 類型檢查
npm run type-check

# 程式碼檢查
npm run lint
```

## 建構生產版本

```bash
npm run build
```

建構結果在 `dist/` 目錄

## 部署

### Vercel（推薦）
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod
```

## 後續開發建議

### 短期（1-2週）
- [ ] 實作迷宮遊戲
- [ ] 實作互動漫畫
- [ ] 添加音效系統（Howler.js）
- [ ] 完善拼圖遊戲邏輯

### 中期（1個月）
- [ ] 實作數學挑戰
- [ ] 實作程式邏輯遊戲
- [ ] 時間管理功能
- [ ] 學習報告圖表

### 長期
- [ ] 多語言支援（i18n）
- [ ] 更多遊戲關卡
- [ ] 成就系統
- [ ] PWA 支援

## 常見問題

### Q: 如何清除所有資料？
A: 進入家長控制台 → 資料管理 → 清除所有資料

### Q: 如何調整遊戲難度？
A: 目前拼圖遊戲會根據年齡組自動調整（4-6歲：4片，7-13歲：9片）

### Q: 本地儲存的資料在哪？
A: 使用瀏覽器的 LocalStorage，可在開發者工具 → Application → Local Storage 查看

## 技術支援

- 查看規格文檔：`docs/specs/`
- 問題回報：GitHub Issues
- 技術文檔：`docs/specs/02-TECHNICAL-SPEC.md`
