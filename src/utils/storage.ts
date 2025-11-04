import type { StorageSchema } from '@/types'

class LocalStorageManager {
  private prefix = 'kids_games_'

  private getDefault<K extends keyof StorageSchema>(key: K): StorageSchema[K] {
    const defaults: StorageSchema = {
      settings: {
        ageGroup: null,
        soundEnabled: true,
        musicEnabled: true,
        voiceEnabled: false,
      },
      progress: {},
      parental: {
        dailyLimit: 60,
        todayUsage: 0,
        lastResetDate: new Date().toISOString().split('T')[0],
        allowedGames: [],
        disabledGames: [],
      },
    }
    return defaults[key]
  }

  get<K extends keyof StorageSchema>(key: K): StorageSchema[K] {
    try {
      const item = localStorage.getItem(this.prefix + key)
      if (!item) {
        return this.getDefault(key)
      }
      return JSON.parse(item)
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error)
      return this.getDefault(key)
    }
  }

  set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error)
    }
  }

  clear(): void {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Error clearing localStorage', error)
    }
  }
}

export const storage = new LocalStorageManager()
