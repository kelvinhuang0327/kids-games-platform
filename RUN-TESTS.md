# 測試執行指南

## 快速測試

### 1. 安裝依賴（首次）
```bash
npm install
```

### 2. 執行所有測試
```bash
npm test
```

預期輸出：
```
✓ src/components/ui/Button.test.tsx (5 tests)
✓ src/utils/storage.test.ts (5 tests)
✓ src/store/useSettingsStore.test.ts (6 tests)
✓ src/store/useGameStore.test.ts (7 tests)
✓ src/pages/Home.test.tsx (8 tests)

Test Files  5 passed (5)
     Tests  31 passed (31)
```

## 各種測試命令

### 監聽模式（開發時使用）
```bash
npm test -- --watch
```
- 自動重新執行變更的測試
- 按 `a` 執行所有測試
- 按 `q` 退出

### 測試特定文件
```bash
npm test Button
npm test storage
npm test Home
```

### 測試覆蓋率
```bash
npm run test:coverage
```

輸出範例：
```
File                  | % Stmts | % Branch | % Funcs | % Lines
----------------------|---------|----------|---------|--------
All files             |   70.12 |    65.45 |   75.32 |   70.12
 components/ui        |   85.71 |    78.12 |   88.88 |   85.71
  Button.tsx          |   85.71 |    78.12 |   88.88 |   85.71
 store                |   90.00 |    85.00 |   92.85 |   90.00
  useGameStore.ts     |   95.23 |    88.88 |  100.00 |   95.23
  useSettingsStore.ts |   84.61 |    81.81 |   85.71 |   84.61
 utils                |   92.85 |    90.00 |   95.00 |   92.85
  storage.ts          |   92.85 |    90.00 |   95.00 |   92.85
```

### 測試 UI（視覺化）
```bash
npm run test:ui
```
- 開啟瀏覽器
- 查看測試結果
- 互動式測試選擇

### 詳細輸出
```bash
npm test -- --reporter=verbose
```

### 執行特定測試
```bash
# 只執行包含 "Button" 的測試
npm test -- -t "Button"

# 只執行包含 "應該渲染" 的測試
npm test -- -t "應該渲染"
```

## 測試文件列表

```
✅ Button.test.tsx          - Button 組件測試（5個測試）
✅ storage.test.ts          - LocalStorage 測試（5個測試）
✅ useSettingsStore.test.ts - 設定狀態測試（6個測試）
✅ useGameStore.test.ts     - 遊戲狀態測試（7個測試）
✅ Home.test.tsx            - 首頁測試（8個測試）

總計: 31 個測試
```

## 常見問題

### Q: 測試失敗怎麼辦？
A: 查看錯誤訊息，通常會指出：
- 哪個文件
- 哪個測試
- 預期 vs 實際結果

### Q: 如何跳過特定測試？
```typescript
it.skip('暫時跳過這個測試', () => {
  // ...
})
```

### Q: 如何只執行特定測試？
```typescript
it.only('只執行這個測試', () => {
  // ...
})
```

### Q: 測試太慢？
```bash
# 使用多執行緒
npm test -- --threads
```

## 驗證測試設置

執行以下命令確認測試正常運作：

```bash
# 1. 檢查是否能找到測試文件
npm test -- --list

# 2. 執行一個簡單測試
npm test Button

# 3. 檢查覆蓋率
npm run test:coverage
```

## CI/CD 整合

測試會自動執行於：
- ✅ 每次 push
- ✅ 每個 pull request
- ✅ 合併前檢查

## 測試最佳實踐

1. **經常執行測試**
   ```bash
   npm test -- --watch
   ```

2. **提交前確保測試通過**
   ```bash
   npm test
   ```

3. **保持測試快速**
   - 避免真實 API 調用
   - 使用 mock
   - 清理副作用

4. **測試命名清晰**
   ```typescript
   it('應該在點擊後更新狀態', () => {})
   ```

## 快速驗證

複製以下命令快速驗證測試功能：

```bash
# 清潔安裝
rm -rf node_modules package-lock.json
npm install

# 執行測試
npm test

# 查看覆蓋率
npm run test:coverage

# 開啟測試 UI
npm run test:ui
```

---

**測試狀態**: ✅ 已配置完成
**測試數量**: 31 個
**預期通過率**: 100%

如有問題請查看 [TESTING.md](TESTING.md) 獲取更多資訊。
