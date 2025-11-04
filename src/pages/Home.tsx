import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          🎮 幼兒遊戲樂園
        </h1>
        <p className="text-xl text-gray-600">
          選擇你的年齡組，開始有趣的學習之旅！
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-shadow"
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">👶</div>
            <h2 className="text-3xl font-bold text-toddler-primary mb-2">
              {AGE_GROUPS['4-6'].name}
            </h2>
            <p className="text-gray-600">4-6 歲</p>
          </div>
          <Button
            variant="toddler"
            size="lg"
            onClick={() => handleAgeSelect('4-6')}
            className="w-full"
          >
            開始遊戲 🎨
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-shadow"
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🧒</div>
            <h2 className="text-3xl font-bold text-kids-primary mb-2">
              {AGE_GROUPS['7-13'].name}
            </h2>
            <p className="text-gray-600">7-13 歲</p>
          </div>
          <Button
            variant="kids"
            size="lg"
            onClick={() => handleAgeSelect('7-13')}
            className="w-full"
          >
            開始遊戲 🚀
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-12 flex gap-4"
      >
        <Button
          variant="default"
          size="md"
          onClick={toggleSound}
        >
          {soundEnabled ? '🔊 音效開啟' : '🔇 音效關閉'}
        </Button>
        <Button
          variant="default"
          size="md"
          onClick={() => navigate('/parent')}
        >
          👨‍👩‍👧‍👦 家長控制台
        </Button>
      </motion.div>
    </div>
  )
}
