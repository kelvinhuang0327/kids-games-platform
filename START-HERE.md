# 🚀 快速啟動指南

## 第一次使用（必讀）

### 步驟 1: 安裝 Node.js（如果還沒安裝）

檢查是否已安裝：
```bash
node --version
npm --version
```

如果沒有安裝，請到 [nodejs.org](https://nodejs.org/) 下載安裝（建議使用 LTS 版本）

### 步驟 2: 安裝專案依賴

在終端機中執行：

```bash
# 進入專案目錄
cd /Users/kelvin/claude\ code\ project/kids-games

# 安裝所有依賴套件
npm install
```

這個步驟會下載所有需要的套件，大約需要 1-3 分鐘。

### 步驟 3: 啟動開發伺服器

```bash
npm run dev
```

您會看到類似這樣的輸出：

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 步驟 4: 開啟瀏覽器

瀏覽器應該會自動開啟 `http://localhost:3000`

如果沒有自動開啟，請手動在瀏覽器輸入：
```
http://localhost:3000
```

## 🎮 開始使用

### 首頁
1. 您會看到兩個大按鈕：
   - **4-6 歲 寶寶樂園** (粉紅色)
   - **7-13 歲 小學天地** (藍色)

2. 點擊任一年齡組進入遊戲大廳

### 遊戲大廳
- 4-6 歲會看到 **3 個遊戲**（拼圖、迷宮、漫畫）
- 7-13 歲會看到 **6 個遊戲**（+ 數學、程式、EdX）

### 拼圖遊戲（目前可玩）
1. 點擊「拼圖」卡片
2. 點擊方塊完成拼圖（簡化版演示）
3. 完成後會看到慶祝動畫
4. 可以選擇「再玩一次」或「返回大廳」

### 家長控制台
1. 點擊首頁右下角「家長專區」
2. 回答簡單數學題：**3 + 5 = ?**（答案是 8）
3. 查看遊戲統計和進度

## 常用命令

```bash
# 啟動開發伺服器
npm run dev

# 停止伺服器（在終端機按）
Ctrl + C

# 執行測試
npm test

# 檢查程式碼
npm run lint

# 格式化程式碼
npm run format

# 建構生產版本
npm run build
```

## 快速測試流程

### 測試 1: 基本導航
1. ✅ 開啟首頁
2. ✅ 點擊「4-6 歲」
3. ✅ 看到 3 個遊戲
4. ✅ 點擊「返回首頁」
5. ✅ 點擊「7-13 歲」
6. ✅ 看到 6 個遊戲

### 測試 2: 玩拼圖遊戲
1. ✅ 選擇任一年齡組
2. ✅ 點擊「拼圖」遊戲
3. ✅ 點擊所有方塊
4. ✅ 看到完成動畫
5. ✅ 點擊「再玩一次」或「返回大廳」

### 測試 3: 家長控制台
1. ✅ 返回首頁
2. ✅ 點擊「家長專區」
3. ✅ 輸入 8（答案）
4. ✅ 查看統計資料
5. ✅ 嘗試「清除所有資料」

## 疑難排解

### 問題 1: npm install 失敗
```bash
# 清除快取重試
npm cache clean --force
npm install
```

### 問題 2: Port 3000 被佔用
```bash
# 使用其他 port
npm run dev -- --port 3001
```

然後開啟 `http://localhost:3001`

### 問題 3: 頁面空白
1. 打開瀏覽器開發者工具（F12）
2. 查看 Console 是否有錯誤
3. 確認終端機沒有錯誤訊息

### 問題 4: 無法安裝依賴
確認 Node.js 版本：
```bash
node --version
# 應該是 v18 或更新
```

## 鍵盤快捷鍵（開發模式）

在終端機中（啟動 dev server 後）：
- `r` - 重新啟動伺服器
- `u` - 顯示伺服器 URL
- `o` - 在瀏覽器中開啟
- `c` - 清除 console
- `q` - 退出

## VSCode 使用者

如果使用 VSCode，可以：

1. **安裝推薦擴充功能**：
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

2. **使用內建終端機**：
   - 按 `` Ctrl + ` `` 開啟終端機
   - 執行 `npm run dev`

3. **開啟專案**：
   ```bash
   code /Users/kelvin/claude\ code\ project/kids-games
   ```

## 下一步

### 查看文檔
- 📖 [README.md](README.md) - 專案介紹
- 🚀 [GETTING-STARTED.md](GETTING-STARTED.md) - 開發指南
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - 架構說明
- ✅ [TESTING.md](TESTING.md) - 測試指南

### 開始開發
1. 查看 `src/` 目錄結構
2. 閱讀 [ARCHITECTURE.md](ARCHITECTURE.md)
3. 查看現有組件的實作
4. 開始添加新功能

## 快速複製命令

```bash
# 一鍵啟動（複製整段）
cd /Users/kelvin/claude\ code\ project/kids-games && npm install && npm run dev
```

如果已經安裝過依賴：
```bash
# 快速啟動（複製）
cd /Users/kelvin/claude\ code\ project/kids-games && npm run dev
```

## 效能提示

- ✅ 第一次啟動較慢（需要安裝依賴）
- ✅ 之後啟動很快（約 1-2 秒）
- ✅ 熱重載：修改程式碼會自動更新頁面
- ✅ 建議使用 Chrome 或 Safari

## 需要幫助？

1. 查看錯誤訊息
2. 檢查 [GETTING-STARTED.md](GETTING-STARTED.md)
3. 查看終端機輸出
4. 檢查瀏覽器 Console（F12）

---

**準備好了嗎？複製以下命令開始：**

```bash
cd /Users/kelvin/claude\ code\ project/kids-games && npm install && npm run dev
```

然後在瀏覽器開啟 http://localhost:3000

🎉 享受使用！
