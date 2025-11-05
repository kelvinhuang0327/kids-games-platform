/**
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
  version: '1.3.0',
  buildTime: '2025-11-05T07:45:02.077Z',
  commitHash: '8a77de2',
  commitDate: '2025-11-05T15:44:52+08:00',
  commitMessage: 'feat: add version badge with deployment tracking',
}

/**
 * 取得格式化的版本字串
 */
export const getVersionString = (): string => {
  return `v${VERSION_INFO.version} (${VERSION_INFO.commitHash})`
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
