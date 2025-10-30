import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { storage } from '@/utils/storage'

export const ParentalControl = () => {
  const navigate = useNavigate()
  const [verified, setVerified] = useState(false)
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')

  const parental = storage.get('parental')
  const progress = storage.get('progress')

  // 簡單驗證: 3 + 5 = ?
  const handleVerify = () => {
    if (answer === '8') {
      setVerified(true)
      setError('')
    } else {
      setError('答案不正確，請重試')
      setAnswer('')
    }
  }

  const handleClearData = () => {
    if (window.confirm('確定要清除所有資料嗎？此操作無法復原。')) {
      storage.clear()
      alert('資料已清除')
      navigate('/')
    }
  }

  if (!verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">👨‍👩‍👧 家長驗證</h2>
          <p className="text-xl mb-6 text-center text-gray-600">
            請回答以下問題進入家長控制台
          </p>

          <div className="bg-blue-50 rounded-2xl p-6 mb-6">
            <p className="text-2xl font-bold text-center">3 + 5 = ?</p>
          </div>

          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-6 py-4 text-2xl border-2 border-gray-300 rounded-2xl mb-4 text-center focus:outline-none focus:border-blue-500"
            placeholder="答案"
            autoFocus
          />

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <div className="flex gap-4">
            <Button onClick={() => navigate('/')} className="flex-1">
              取消
            </Button>
            <Button variant="kids" onClick={handleVerify} className="flex-1">
              確認
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const totalGames = Object.keys(progress || {}).length
  const completedGames = Object.values(progress || {}).filter((p) => p.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">🔐 家長控制台</h1>
          <Button onClick={() => navigate('/')}>← 返回首頁</Button>
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">📊 遊戲統計</h3>
            <div className="space-y-2">
              <p className="text-lg">總遊戲數: <span className="font-bold">{totalGames}</span></p>
              <p className="text-lg">已完成: <span className="font-bold">{completedGames}</span></p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">⏱️ 使用時間</h3>
            <div className="space-y-2">
              <p className="text-lg">
                今日使用: <span className="font-bold">{parental?.todayUsage || 0}</span> 分鐘
              </p>
              <p className="text-lg">
                每日限制: <span className="font-bold">{parental?.dailyLimit || 60}</span> 分鐘
              </p>
            </div>
          </div>
        </motion.div>

        {/* Game Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-xl font-bold mb-4">🎮 遊戲進度</h3>
          {totalGames === 0 ? (
            <p className="text-gray-500">尚無遊戲記錄</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(progress || {}).map(([gameId, data]) => (
                <div key={gameId} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-bold capitalize">{gameId}</p>
                    <p className="text-sm text-gray-600">
                      嘗試次數: {data.attempts} |
                      {data.completed ? ' ✅ 已完成' : ' ⏳ 進行中'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">最佳分數: {data.bestScore}</p>
                    <p className="text-sm">最佳時間: {Math.round(data.bestTime / 1000)}秒</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold mb-4">⚙️ 資料管理</h3>
          <p className="text-gray-600 mb-4">
            所有資料僅存於您的裝置，不會上傳雲端
          </p>
          <Button variant="default" onClick={handleClearData}>
            🗑️ 清除所有資料
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
