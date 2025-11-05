/**
 * 語音鼓勵與提示工具
 * 使用瀏覽器的 Web Speech API 提供語音反饋
 */

// 成功時的英文鼓勵語音（5種）
export const SUCCESS_MESSAGES = [
  'Great job!',
  'Excellent!',
  'Well done!',
  'Fantastic!',
  'Perfect!',
]

// 失敗時的再接再厲提示（5種）
export const FAILURE_MESSAGES = [
  'Try again!',
  'Keep going!',
  'You can do it!',
  'Almost there!',
  'Don\'t give up!',
]

/**
 * 播放語音反饋
 * @param message - 要播放的訊息
 * @param lang - 語言代碼，預設為英文
 * @param rate - 語速，預設為 1.0
 * @param pitch - 音調，預設為 1.0
 */
export const speakMessage = (
  message: string,
  lang: string = 'en-US',
  rate: number = 1.0,
  pitch: number = 1.0
): void => {
  // 檢查瀏覽器是否支援 Speech Synthesis API
  if (!('speechSynthesis' in window)) {
    console.warn('此瀏覽器不支援語音合成功能')
    return
  }

  // 取消當前正在播放的語音
  window.speechSynthesis.cancel()

  // 創建新的語音實例
  const utterance = new SpeechSynthesisUtterance(message)
  utterance.lang = lang
  utterance.rate = rate
  utterance.pitch = pitch
  utterance.volume = 1.0

  // 播放語音
  window.speechSynthesis.speak(utterance)
}

/**
 * 播放隨機的成功鼓勵語音
 */
export const playSuccessMessage = (): void => {
  const randomMessage = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]
  speakMessage(randomMessage)
}

/**
 * 播放隨機的失敗提示語音
 */
export const playFailureMessage = (): void => {
  const randomMessage = FAILURE_MESSAGES[Math.floor(Math.random() * FAILURE_MESSAGES.length)]
  speakMessage(randomMessage)
}

/**
 * 播放特定的成功鼓勵語音
 * @param index - 訊息索引（0-4）
 */
export const playSuccessMessageByIndex = (index: number): void => {
  if (index >= 0 && index < SUCCESS_MESSAGES.length) {
    speakMessage(SUCCESS_MESSAGES[index])
  }
}

/**
 * 播放特定的失敗提示語音
 * @param index - 訊息索引（0-4）
 */
export const playFailureMessageByIndex = (index: number): void => {
  if (index >= 0 && index < FAILURE_MESSAGES.length) {
    speakMessage(FAILURE_MESSAGES[index])
  }
}

/**
 * 停止當前播放的語音
 */
export const stopSpeech = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
