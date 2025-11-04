import { create } from 'zustand'
import type { Settings, AgeGroup } from '@/types'
import { storage } from '@/utils/storage'

interface SettingsState extends Settings {
  setAgeGroup: (ageGroup: AgeGroup) => void
  toggleSound: () => void
  toggleMusic: () => void
  toggleVoice: () => void
  reset: () => void
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...storage.get('settings'),

  setAgeGroup: (ageGroup) => {
    set({ ageGroup })
    storage.set('settings', get())
  },

  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }))
    storage.set('settings', get())
  },

  toggleMusic: () => {
    set((state) => ({ musicEnabled: !state.musicEnabled }))
    storage.set('settings', get())
  },

  toggleVoice: () => {
    set((state) => ({ voiceEnabled: !state.voiceEnabled }))
    storage.set('settings', get())
  },

  reset: () => {
    const defaults = storage.get('settings')
    set(defaults)
    storage.set('settings', defaults)
  },
}))
