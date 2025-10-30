import { describe, it, expect, beforeEach } from 'vitest'
import { storage } from './storage'

describe('Storage Utility', () => {
  beforeEach(() => {
    // 清空 localStorage
    localStorage.clear()
  })

  it('應該能夠存儲和讀取設定', () => {
    const settings = {
      ageGroup: '4-6' as const,
      soundEnabled: true,
      musicEnabled: true,
      voiceEnabled: true,
    }

    storage.set('settings', settings)
    const retrieved = storage.get('settings')

    expect(retrieved).toEqual(settings)
  })

  it('應該能夠存儲和讀取遊戲進度', () => {
    const progress = {
      puzzle: {
        completed: true,
        bestScore: 100,
        bestTime: 60000,
        attempts: 3,
        lastPlayed: '2025-10-27',
      },
    }

    storage.set('progress', progress)
    const retrieved = storage.get('progress')

    expect(retrieved).toEqual(progress)
  })

  it('讀取不存在的 key 應該返回預設值', () => {
    const settings = storage.get('settings')

    expect(settings).toBeDefined()
    expect(settings?.ageGroup).toBeNull()
    expect(settings?.soundEnabled).toBe(true)
  })

  it('應該能夠移除儲存的資料', () => {
    storage.set('settings', {
      ageGroup: '4-6',
      soundEnabled: true,
      musicEnabled: true,
      voiceEnabled: true,
    })

    storage.remove('settings')
    const retrieved = storage.get('settings')

    // 應該返回預設值
    expect(retrieved?.ageGroup).toBeNull()
  })

  it('應該能夠清除所有資料', () => {
    storage.set('settings', {
      ageGroup: '4-6',
      soundEnabled: true,
      musicEnabled: true,
      voiceEnabled: true,
    })
    storage.set('progress', {})

    storage.clear()

    // 檢查 localStorage 中沒有我們的 key
    let hasOurKeys = false
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('kids_games_')) {
        hasOurKeys = true
        break
      }
    }

    expect(hasOurKeys).toBe(false)
  })
})
