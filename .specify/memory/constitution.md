
<!--
Sync Impact Report
Version: (old) v0.1.0 → (new) v0.2.0
Modified Principles: (none renamed)
Added Principles: VI. 兒童安全與隱私保護
Added Sections: 版本資訊與治理擴充, 修訂程序, 合規稽核節奏
Removed Sections: (none)
Templates Review:
	.specify/templates/plan-template.md → ✅ Constitution gates clarified
	.specify/templates/spec-template.md → ⚠ TODO: Consider adding explicit privacy acceptance criteria
	.specify/templates/tasks-template.md → ✅ No change required (principle references implicit)
	.specify/templates/checklist-template.md → ⚠ TODO: Add privacy &效能 checklist category
	.specify/templates/agent-file-template.md → ⚠ TODO: Will populate active principles in next generation
Deferred Items: None (all placeholders resolved). If future original ratification date differs, amend RATCHANGE.
-->

# 幼兒網頁遊戲平台 (Kids Games Platform) 專案憲章

**憲章版本**: v0.2.0  
**首次採納日期 (Ratification Date)**: 2025-10-30  
**最後修訂日期 (Last Amended Date)**: 2025-11-05  
**版本升級理由**: 新增「兒童安全與隱私保護」核心原則，並擴充治理與版本管理政策（屬於 MINOR 變更）。

## 核心原則

### I. 程式碼品質優先
所有程式碼 MUST 遵循既定編碼標準 (ESLint + Prettier)；每個功能 MUST 具備單元測試；Pull Request MUST 經審查與測試全數通過；重構 MUST 優先於新增技術債務；禁止未經驗證的捷徑或「暫時性」髒修補。

**理由**: 高品質程式碼確保長期維護性、降低缺陷與回歸成本，支撐未來擴充（後端、多人、分析）。

### II. 使用者體驗一致性
UI 元件 MUST 重用既有設計系統；互動行為（按鈕回饋、過場、錯誤提示） MUST 一致；需符合響應式標準（桌機/平板/手機）；無障礙考量 SHOULD 朝 WCAG 2.1 AA 漸進實作；所有載入、成功、錯誤狀態 MUST 明確顯示。

**理由**: 一致且可預測的體驗降低學習成本，提升留存與可用性測試通過率。

### III. 效能要求 (不可協商)
首頁首次載入 (TTI) MUST < 3s；互動回應 MUST < 100ms；Lighthouse 效能分數 MUST ≥ 90；需實施程式碼分割與懶載入；圖片與靜態資源 MUST 經壓縮與正確格式化；效能回歸測試 SHOULD 每階段執行。

**理由**: 優異效能直接影響兒童操作流暢度與教育互動完成率。

### IV. 技術標準
語言 MUST 為 TypeScript (ES6+ 特性)；架構 MUST 模組化且可獨立測試；狀態 MUST 經集中管理（Zustand）；路由 MUST 使用 React Router；前端建構 MUST 使用 Vite；未來擴展（後端/API）遵循 RESTful；禁止引入不必要大型依賴。

**理由**: 一致技術選擇避免碎片化與重複成本，確保演進穩定。

### V. 文件與註解規範
所有文件（README、規格、計劃） MUST 使用正體中文；程式碼命名 MUST 使用英文；程式碼註解 MUST 使用正體中文；UI、錯誤訊息與家長介面文字 MUST 使用正體中文；技術規格與資料模型說明 MUST 清晰、可測試、無模糊語言。

**理由**: 清楚語言與一致註解提升團隊溝通效率與新成員加入速度。

### VI. 兒童安全與隱私保護
MVP 階段 MUST 零追蹤、零第三方分析、零 Cookie；所有資料 MUST 僅存於 LocalStorage；禁止收集個人識別資訊 (PII)；家長控制機制 MUST 可清除所有本地資料；未來擴充需符合 COPPA/GDPR（此前不得提前收集潛在個資）。

**理由**: 隱私安全是兒童教育平台的信任基石，降低法規風險並加速合法擴展。

## 技術決策治理

### 架構決策記錄
重大技術或依賴決策 MUST 以 ADR（Architecture Decision Record）形式建立於 `docs/architecture/`：包含背景、選項、評估、決策、後果；既有決策不可覆寫，變更 MUST 以新檔追加；缺少 ADR 的重大變更 SHALL 不得合併。

### 依賴管理
新增依賴 MUST 通過安全與效能評估（大小、維護活躍度、社群成熟度）；依賴版本 SHOULD 每月審視；安全性掃描（CVE） MUST 在升級前執行；禁止引入與平台核心目標無關的大型框架。

### 效能監控
需建立可量測指標（TTI、交互延遲、資源體積）並隨開發階段檢視；效能預算（初始載入 JS ≤ 250KB gzip） MUST 被遵守；超出預算變更 MUST 先提出重構計畫。

## 開發流程與品質保證

### 程式碼審查流程
所有 PR MUST 經至少 1 位成員審查；審查 MUST 涵蓋：功能正確性、測試完整性、效能影響、隱私遵循、可維護性；測試（單元/組件） MUST 全數通過；如違反原則需附「例外理由」與修復時程，避免永久豁免。

### 測試要求
新增功能 MUST 最低包含：核心邏輯單元測試 + 關鍵互動組件測試；覆蓋率目標 70%（MVP）→ 80%（下一階段）；重大重構 MUST 保持不下降；測試失敗 SHALL 阻擋合併。

## 治理與版本政策

### 版本語意
PATCH：措辭修正、非行為性澄清；MINOR：新增或擴充原則、治理條款；MAJOR：移除或根本重定義原則。

### 修訂程序
1. 提案（Issue 或 ADR）  
2. 評估（風險 / 對現有開發影響）  
3. 共識（團隊 ≥ 2 成員 + 發起者）  
4. 版本決策（語意分類）  
5. 文件更新（本憲章 + 受影響模板）  
6. 發佈（標記版本 + Sync Impact Report）

### 合規驗證
PR 模板 SHOULD 提醒勾選「憲章原則檢查」；月度（或里程碑結束） MUST 執行一次憲章對照稽核：檢查效能預算、依賴狀態、測試覆蓋率、隱私合規。違規項目 SHALL 建立修復任務，不得延後超過一個開發階段。

### 例外管理
例外 MUST 附：暫時原因、替代方案考慮、修復期限；逾期未修復 SHALL 升級為阻塞項目。

### 自動化與工具
Lint、格式化、測試、效能分析 SHOULD 於 CI 執行；憲章規則可漸進映射為自動檢查（例如：bundle size、依賴白名單）。

## 優先級與衝突解決
若原則間衝突，優先順序：兒童安全與隱私 → 效能不可協商 → 基礎程式碼品質 → 使用者體驗一致性 → 技術標準 → 文件規範。任何偏離此順序之決策 MUST 於 ADR 中說明。

## 附錄：追蹤指標
| 類別 | 指標 | 目前目標 |
|------|------|---------|
| 品質 | 測試覆蓋率 | ≥70% (近期目標 80%) |
| 效能 | 首次載入 JS 體積 | ≤250KB gzip |
| 效能 | 互動延遲 | <100ms |
| 隱私 | 第三方追蹤 | 0 |
| 安全 | 未掃描依賴 | 0 |

---
本文件之原則與治理條款優先於其他未同步之規格、計劃或歷史文件。修改需遵循「修訂程序」並更新版本與發佈報告。