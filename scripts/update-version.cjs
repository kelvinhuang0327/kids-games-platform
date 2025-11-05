#!/usr/bin/env node

/**
 * 自動更新版本資訊腳本
 * 從 Git 獲取最新的 commit 資訊並更新 src/utils/version.ts
 *
 * 使用方式：
 * node scripts/update-version.js [version]
 *
 * 範例：
 * node scripts/update-version.js 1.2.1
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 從命令列參數獲取版本號，或使用現有版本號
const newVersion = process.argv[2]

// 從 Git 獲取資訊
try {
  const commitHash = execSync('git rev-parse --short HEAD').toString().trim()
  const commitDate = execSync('git log -1 --format=%cI').toString().trim()
  const commitMessage = execSync('git log -1 --format=%s').toString().trim()
  const buildTime = new Date().toISOString()

  // 讀取現有版本檔案以獲取當前版本號
  const versionFilePath = path.join(__dirname, '../src/utils/version.ts')
  let currentVersion = '1.2.0' // 預設版本

  if (fs.existsSync(versionFilePath)) {
    const content = fs.readFileSync(versionFilePath, 'utf-8')
    const versionMatch = content.match(/version:\s*'([^']+)'/)
    if (versionMatch) {
      currentVersion = versionMatch[1]
    }
  }

  // 使用新版本號或保持現有版本號
  const version = newVersion || currentVersion

  // 生成新的版本檔案內容
  const versionFileContent = `/**
 * 版本資訊
 * 每次 commit 時應該更新此檔案
 */

export interface VersionInfo {
  version: string      // 版本號
  buildTime: string    // 構建時間
  commitHash: string   // Git commit hash (短版)
  commitDate: string   // Commit 日期時間
  commitMessage: string // Commit 訊息
}

export const VERSION_INFO: VersionInfo = {
  version: '${version}',
  buildTime: '${buildTime}',
  commitHash: '${commitHash}',
  commitDate: '${commitDate}',
  commitMessage: '${commitMessage.replace(/'/g, "\\'")}',
}

/**
 * 取得格式化的版本字串
 */
export const getVersionString = (): string => {
  return \`v\${VERSION_INFO.version} (\${VERSION_INFO.commitHash})\`
}

/**
 * 取得格式化的構建時間
 */
export const getBuildTimeString = (): string => {
  const date = new Date(VERSION_INFO.buildTime)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 取得格式化的 commit 時間
 */
export const getCommitTimeString = (): string => {
  const date = new Date(VERSION_INFO.commitDate)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
`

  // 寫入檔案
  fs.writeFileSync(versionFilePath, versionFileContent, 'utf-8')

  console.log('✅ 版本資訊已更新!')
  console.log(`📦 版本: ${version}`)
  console.log(`🔖 Commit: ${commitHash}`)
  console.log(`📅 時間: ${commitDate}`)
  console.log(`💬 訊息: ${commitMessage}`)

} catch (error) {
  console.error('❌ 更新版本資訊失敗:', error.message)
  process.exit(1)
}
