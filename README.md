# 幼兒網頁遊戲平台 (Kids Games Platform)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)

> 一個安全、具教育意義、適合 4-13 歲兒童的網頁遊戲平台

## 專案簡介

幼兒網頁遊戲平台是一個專為兒童設計的線上學習遊戲網站，提供：
- 分齡設計 (4-6 歲 / 7-13 歲)
- 多款教育遊戲 (拼圖、迷宮、互動漫畫、數學挑戰、程式邏輯等)
- 家長控制功能 (時間管理、學習報告)
- 零廣告、無追蹤、重視隱私保護
- 跨裝置響應式設計

## 核心特色

### 為兒童設計
- 直覺易用的介面
- 大按鈕、高對比度
- 豐富的音效與動畫回饋
- 語音引導 (4-6 歲組)

### 安全與隱私
- 無個人資料收集
- 本地儲存遊戲進度
- 無第三方追蹤
- 符合 COPPA/GDPR 標準

### 家長友善
- 時間管理與限制
- 學習進度報告
- 遊戲內容控管
- 透明的隱私政策

## 技術架構

- **前端框架**: React 18 + TypeScript
- **建構工具**: Vite
- **狀態管理**: Zustand
- **樣式**: Tailwind CSS
- **動畫**: Framer Motion
- **遊戲渲染**: HTML5 Canvas / PixiJS
- **音效**: Howler.js
- **測試**: Vitest + Playwright

## 專案結構

```
kids-games/
├── docs/                       # 文件
│   └── specs/                  # 規格文件
│       ├── 01-CONTENT-SPEC.md  # 內容與功能規格
│       ├── 02-TECHNICAL-SPEC.md # 技術規格
│       └── 03-QC-SPEC.md       # QC測試規格
├── public/                     # 靜態資源
├── src/                        # 源代碼
│   ├── components/             # 共用組件
│   ├── features/               # 功能模組
│   ├── pages/                  # 頁面
│   ├── store/                  # 狀態管理
│   └── utils/                  # 工具函式
├── tests/                      # 測試
└── README.md
```

## 快速開始

### 環境需求

- Node.js 18+
- npm 或 yarn

### 安裝

```bash
# 克隆專案
git clone https://github.com/your-org/kids-games.git
cd kids-games

# 安裝依賴
npm install
```

### 開發

```bash
# 啟動開發伺服器
npm run dev

# 開啟瀏覽器訪問 http://localhost:3000
```

### 測試

```bash
# 執行單元測試
npm run test

# 執行測試並查看覆蓋率
npm run test:coverage

# 執行 E2E 測試
npm run test:e2e

# 執行測試 UI
npm run test:ui
```

### 建構

```bash
# 建構生產版本
npm run build

# 預覽建構結果
npm run preview
```

### 程式碼品質

```bash
# 執行 ESLint
npm run lint

# 格式化程式碼
npm run format

# 類型檢查
npm run type-check
```

## 遊戲列表

### 4-6 歲 (寶寶樂園)
- **拼圖遊戲**: 4-9 片大塊拼圖，培養空間認知
- **迷宮遊戲**: 簡單路徑，訓練導航能力
- **互動漫畫**: 語音導向故事，啟發創意

### 7-13 歲 (小學天地)
- **拼圖遊戲**: 16-64 片拼圖，進階挑戰
- **迷宮遊戲**: 策略性迷宮，邏輯訓練
- **互動漫畫**: 分支劇情，閱讀理解
- **數學挑戰**: 運算與應用題，數學能力
- **程式邏輯**: 視覺化程式設計，運算思維
- **EdX 推薦**: 精選教育資源，多元學習

## 文件

完整的專案文件位於 [docs/specs/](docs/specs/) 目錄：

1. **[內容與功能規格](docs/specs/01-CONTENT-SPEC.md)**: 產品功能、使用者體驗、UI/UX 設計
2. **[技術規格](docs/specs/02-TECHNICAL-SPEC.md)**: 技術架構、模組設計、開發規範
3. **[QC 測試規格](docs/specs/03-QC-SPEC.md)**: 測試策略、測試案例、品質標準

## 開發指南

### 命名規範

- **組件**: PascalCase (例: `GameCard.tsx`)
- **函式/變數**: camelCase (例: `handleClick`)
- **常數**: UPPER_SNAKE_CASE (例: `MAX_ATTEMPTS`)
- **檔案名稱**: kebab-case (例: `game-card.tsx`)

### Git 提交規範

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**:
- `feat`: 新功能
- `fix`: 修復 Bug
- `docs`: 文件更新
- `style`: 程式碼格式調整
- `refactor`: 重構
- `test`: 測試相關
- `chore`: 建構/工具相關

**範例**:
```
feat(puzzle): add rotation feature for advanced mode

- Implement piece rotation on right-click
- Add rotation animation
- Update puzzle logic to handle rotated pieces

Closes #123
```

### 分支策略

- `main`: 生產環境分支
- `develop`: 開發分支
- `feature/*`: 功能開發分支
- `bugfix/*`: Bug 修復分支
- `hotfix/*`: 緊急修復分支

### Pull Request 流程

1. 從 `develop` 建立功能分支
2. 開發並提交變更
3. 確保所有測試通過
4. 建立 PR 至 `develop`
5. Code Review
6. 合併後自動部署至測試環境

## 部署

### Vercel 部署 (推薦)

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### Netlify 部署

```bash
# 安裝 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod
```

### GitHub Pages 部署

```bash
# 建構
npm run build

# 部署至 gh-pages 分支
npm run deploy
```

## 瀏覽器支援

| 瀏覽器 | 最低版本 |
|--------|----------|
| Chrome | 90+ |
| Safari | 14+ |
| Firefox | 88+ |
| Edge | 90+ |

## 授權

本專案採用 [MIT License](LICENSE)。

## 貢獻

歡迎貢獻！請參閱 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何參與專案。

### 貢獻者

感謝所有貢獻者的付出！

<!-- 可加入貢獻者圖片 -->

## 路線圖

### v1.0 (MVP) - 2025 Q2
- [x] 基礎架構建立
- [x] 2 個年齡組介面
- [x] 3 款核心遊戲 (拼圖、迷宮、漫畫)
- [x] 家長控制基礎功能
- [x] 本地儲存

### v1.1 - 2025 Q3
- [ ] 數學挑戰遊戲
- [ ] 程式邏輯遊戲
- [ ] EdX 推薦整合
- [ ] 學習報告強化

### v1.2 - 2025 Q4
- [ ] 多語言支援 (繁中、簡中、英文)
- [ ] 更多遊戲主題
- [ ] 成就系統
- [ ] 雲端同步 (可選)

### v2.0 - 2026
- [ ] 教師版本
- [ ] 自訂關卡編輯器
- [ ] 社群功能 (受管控)
- [ ] 更多進階遊戲

## 常見問題 (FAQ)

### Q: 這個平台需要註冊嗎？
A: 不需要。所有資料都存在本地，無需註冊或登入。

### Q: 資料會上傳到雲端嗎？
A: 不會。所有遊戲進度和設定都僅存於您的裝置上。

### Q: 如何設定遊戲時間限制？
A: 點擊右上角「家長」按鈕，完成驗證後進入家長控制台設定。

### Q: 支援哪些裝置？
A: 支援桌面、平板和手機，但建議使用平板或桌面以獲得最佳體驗。

### Q: 這是免費的嗎？
A: 是的，完全免費且無廣告。

### Q: 如何回報問題？
A: 請到 [GitHub Issues](https://github.com/your-org/kids-games/issues) 回報。

## 聯絡方式

- **專案網站**: https://kids-games.example.com
- **問題回報**: [GitHub Issues](https://github.com/your-org/kids-games/issues)
- **Email**: support@kids-games.example.com

## 致謝

本專案使用了以下優秀的開源專案：
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Howler.js](https://howlerjs.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

**用愛心與科技，為孩子打造更好的學習環境** ❤️
