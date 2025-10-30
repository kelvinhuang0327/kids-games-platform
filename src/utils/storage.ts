import type { StorageSchema } from '@/types'
import { DEFAULT_SETTINGS, DEFAULT_PARENTAL } from './constants'

const PREFIX = 'kids_games_'

class LocalStorage {
  get<K extends keyof StorageSchema>(key: K): StorageSchema[K] | null {
    try {
      const item = localStorage.getItem(PREFIX + key)
      if (!item) return this.getDefault(key)
      return JSON.parse(item)
    } catch {
      return this.getDefault(key)
    }
  }

  set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (error) {
      console.error('Storage set error:', error)
    }
  }

  remove<K extends keyof StorageSchema>(key: K): void {
    localStorage.removeItem(PREFIX + key)
  }

  clear(): void {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  }

  private getDefault<K extends keyof StorageSchema>(key: K): StorageSchema[K] {
    const defaults: Record<string, unknown> = {
      settings: DEFAULT_SETTINGS,
      parental: DEFAULT_PARENTAL,
      progress: {},
    }
    return defaults[key] as StorageSchema[K]
  }
}

export const storage = new LocalStorage()
