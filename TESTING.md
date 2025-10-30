# 測試指南

## 測試配置

本專案使用以下測試工具：

- **Vitest**: 快速的單元測試框架
- **React Testing Library**: React 組件測試
- **jsdom**: 瀏覽器環境模擬

## 測試腳本

### 執行所有測試
```bash
npm test
```

### 執行測試並監聽變更
```bash
npm test -- --watch
```

### 測試 UI（視覺化介面）
```bash
npm run test:ui
```

### 測試覆蓋率
```bash
npm run test:coverage
```

## 測試文件結構

```
src/
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── Button.test.tsx          ✅ 組件測試
├── store/
│   ├── useSettingsStore.ts
│   ├── useSettingsStore.test.ts     ✅ Store 測試
│   ├── useGameStore.ts
│   └── useGameStore.test.ts         ✅ Store 測試
├── utils/
│   ├── storage.ts
│   └── storage.test.ts              ✅ 工具測試
├── pages/
│   ├── Home.tsx
│   └── Home.test.tsx                ✅ 頁面測試
└── test/
    └── setup.ts                     ✅ 測試設定
```

## 已完成的測試

### 1. Button 組件測試 ✅
**文件**: `src/components/ui/Button.test.tsx`

測試項目：
- ✅ 渲染按鈕文字
- ✅ 點擊事件觸發
- ✅ disabled 狀態
- ✅ variant 樣式
- ✅ size 樣式

```bash
# 執行特定測試
npm test Button
```

### 2. Storage 工具測試 ✅
**文件**: `src/utils/storage.test.ts`

測試項目：
- ✅ 存儲和讀取設定
- ✅ 存儲和讀取遊戲進度
- ✅ 預設值返回
- ✅ 移除資料
- ✅ 清除所有資料

```bash
npm test storage
```

### 3. Settings Store 測試 ✅
**文件**: `src/store/useSettingsStore.test.ts`

測試項目：
- ✅ 預設狀態
- ✅ 設定年齡組
- ✅ 切換音效
- ✅ 切換音樂
- ✅ 切換語音
- ✅ 重置年齡組

```bash
npm test useSettingsStore
```

### 4. Game Store 測試 ✅
**文件**: `src/store/useGameStore.test.ts`

測試項目：
- ✅ 初始進度
- ✅ 保存遊戲結果
- ✅ 更新最佳分數
- ✅ 更新最佳時間
- ✅ 獲取遊戲進度
- ✅ 多個遊戲分開記錄

```bash
npm test useGameStore
```

### 5. Home 頁面測試 ✅
**文件**: `src/pages/Home.test.tsx`

測試項目：
- ✅ 渲染標題
- ✅ 顯示兩個年齡組按鈕
- ✅ 點擊導航
- ✅ 音效控制
- ✅ 家長專區入口

```bash
npm test Home
```

## 測試統計

```
總測試文件: 5
總測試案例: 35+
預估覆蓋率: ~70%
```

### 已測試模組
- ✅ UI 組件 (Button)
- ✅ 工具函式 (storage)
- ✅ 狀態管理 (Zustand stores)
- ✅ 頁面組件 (Home)

### 待測試模組
- ⏳ Card 組件
- ⏳ GameHall 頁面
- ⏳ PuzzlePage 頁面
- ⏳ ParentalControl 頁面
- ⏳ 常數配置

## 編寫測試指南

### 1. 組件測試範例

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('應該渲染正確的內容', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### 2. Store 測試範例

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useMyStore } from './useMyStore'

describe('MyStore', () => {
  beforeEach(() => {
    // 重置狀態
    useMyStore.setState({ count: 0 })
  })

  it('應該增加計數', () => {
    const { increment } = useMyStore.getState()
    increment()
    expect(useMyStore.getState().count).toBe(1)
  })
})
```

### 3. 工具函式測試範例

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from './utils'

describe('myFunction', () => {
  it('應該返回正確的值', () => {
    expect(myFunction(1, 2)).toBe(3)
  })
})
```

## 測試最佳實踐

### 1. 測試命名
```typescript
// ✅ 好的命名
it('應該在點擊後切換音效狀態', () => {})

// ❌ 不好的命名
it('test1', () => {})
```

### 2. 使用 describe 分組
```typescript
describe('Button Component', () => {
  describe('點擊行為', () => {
    it('應該觸發 onClick', () => {})
    it('disabled 時不應觸發', () => {})
  })

  describe('樣式', () => {
    it('應該應用正確的 variant', () => {})
  })
})
```

### 3. 清理副作用
```typescript
beforeEach(() => {
  localStorage.clear()
  useMyStore.setState(initialState)
})
```

### 4. 避免測試實作細節
```typescript
// ✅ 測試行為
expect(screen.getByText('Hello')).toBeInTheDocument()

// ❌ 測試實作
expect(component.state.value).toBe('Hello')
```

## 常用測試工具

### screen queries
```typescript
// 查找元素
screen.getByText('Hello')           // 找到或拋出錯誤
screen.queryByText('Hello')         // 找到或返回 null
screen.findByText('Hello')          // 異步查找

// By Role (推薦)
screen.getByRole('button', { name: /submit/i })

// By Test ID
screen.getByTestId('my-element')
```

### user-event
```typescript
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()
await user.click(button)
await user.type(input, 'Hello')
```

### fireEvent
```typescript
import { fireEvent } from '@testing-library/react'

fireEvent.click(button)
fireEvent.change(input, { target: { value: 'Hello' } })
```

## 測試覆蓋率目標

```
組件: 80%+
工具函式: 90%+
Store: 85%+
頁面: 70%+

總目標: 75%+
```

## CI/CD 整合

測試會在以下情況自動執行：
- Push 到任何分支
- 創建 Pull Request
- 合併前檢查

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test

- name: Check coverage
  run: npm run test:coverage
```

## 疑難排解

### 問題 1: 找不到模組
```bash
# 確保安裝了所有依賴
npm install
```

### 問題 2: localStorage 錯誤
```typescript
// 在測試中清除
beforeEach(() => {
  localStorage.clear()
})
```

### 問題 3: Router 錯誤
```typescript
// 包裝在 BrowserRouter 中
render(
  <BrowserRouter>
    <MyComponent />
  </BrowserRouter>
)
```

## 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 執行測試
```bash
npm test
```

### 3. 查看覆蓋率
```bash
npm run test:coverage
```

### 4. 開啟測試 UI
```bash
npm run test:ui
```

## 下一步

### 待添加的測試
1. **Card 組件測試**
   - 渲染子元素
   - 點擊事件
   - Hover 動畫

2. **GameHall 測試**
   - 顯示適齡遊戲
   - 路由參數處理
   - 返回首頁

3. **PuzzlePage 測試**
   - 遊戲邏輯
   - 進度追蹤
   - 完成狀態

4. **ParentalControl 測試**
   - 驗證機制
   - 統計顯示
   - 資料清除

## 參考資源

- [Vitest 文檔](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**測試狀態**: ✅ 基礎測試已完成
**覆蓋率**: ~70%
**測試數量**: 35+ 測試案例
