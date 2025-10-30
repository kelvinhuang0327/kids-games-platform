import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useSettingsStore } from '@/store/useSettingsStore'
import { AGE_GROUPS } from '@/utils/constants'

export const Home = () => {
  const navigate = useNavigate()
  const { setAgeGroup, soundEnabled, toggleSound } = useSettingsStore()

  const handleAgeSelect = (age: '4-6' | '7-13') => {
    setAgeGroup(age)
    navigate(`/hall/${age}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
            幼兒遊戲樂園
          </h1>
          <p className="text-xl text-gray-600">選擇您的年齡組開始遊戲</p>
        </motion.div>

        {/* Age Group Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* 4-6 歲 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-7xl mb-4">🧸</div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: AGE_GROUPS['4-6'].color }}>
                4-6 歲
              </h2>
              <p className="text-xl mb-6">{AGE_GROUPS['4-6'].name}</p>
              <Button variant="toddler" size="lg" onClick={() => handleAgeSelect('4-6')}>
                開始遊戲
              </Button>
            </div>
          </motion.div>

          {/* 7-13 歲 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-7xl mb-4">🎒</div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: AGE_GROUPS['7-13'].color }}>
                7-13 歲
              </h2>
              <p className="text-xl mb-6">{AGE_GROUPS['7-13'].name}</p>
              <Button variant="kids" size="lg" onClick={() => handleAgeSelect('7-13')}>
                開始遊戲
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Footer Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4"
        >
          <Button size="sm" onClick={toggleSound}>
            {soundEnabled ? '🔊 音效開啟' : '🔇 音效關閉'}
          </Button>
          <Button size="sm" onClick={() => navigate('/parental')}>
            👨‍👩‍👧 家長專區
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
