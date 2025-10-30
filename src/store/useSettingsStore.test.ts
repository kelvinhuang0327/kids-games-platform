import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from './useSettingsStore'

describe('Settings Store', () => {
  beforeEach(() => {
    // 重置 store 狀態
    localStorage.clear()
    useSettingsStore.setState({
      ageGroup: null,
      soundEnabled: true,
      musicEnabled: true,
      voiceEnabled: true,
    })
  })

  it('應該有預設狀態', () => {
    const state = useSettingsStore.getState()

    expect(state.ageGroup).toBeNull()
    expect(state.soundEnabled).toBe(true)
    expect(state.musicEnabled).toBe(true)
    expect(state.voiceEnabled).toBe(true)
  })

  it('應該能夠設定年齡組', () => {
    const { setAgeGroup } = useSettingsStore.getState()

    setAgeGroup('4-6')
    const state = useSettingsStore.getState()

    expect(state.ageGroup).toBe('4-6')
  })

  it('應該能夠切換音效', () => {
    const { toggleSound } = useSettingsStore.getState()

    const initialState = useSettingsStore.getState().soundEnabled
    toggleSound()
    const newState = useSettingsStore.getState().soundEnabled

    expect(newState).toBe(!initialState)
  })

  it('應該能夠切換音樂', () => {
    const { toggleMusic } = useSettingsStore.getState()

    const initialState = useSettingsStore.getState().musicEnabled
    toggleMusic()
    const newState = useSettingsStore.getState().musicEnabled

    expect(newState).toBe(!initialState)
  })

  it('應該能夠切換語音', () => {
    const { toggleVoice } = useSettingsStore.getState()

    const initialState = useSettingsStore.getState().voiceEnabled
    toggleVoice()
    const newState = useSettingsStore.getState().voiceEnabled

    expect(newState).toBe(!initialState)
  })

  it('應該能夠重置年齡組', () => {
    const { setAgeGroup, reset } = useSettingsStore.getState()

    setAgeGroup('7-13')
    expect(useSettingsStore.getState().ageGroup).toBe('7-13')

    reset()
    expect(useSettingsStore.getState().ageGroup).toBeNull()
  })
})
