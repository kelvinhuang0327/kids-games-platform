import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VERSION_INFO, getVersionString, getCommitTimeString } from '@/utils/version'

/**
 * 版本標籤組件
 * 顯示在頁面右下角，點擊可展開詳細資訊
 */
export const VersionBadge = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute bottom-12 right-0 bg-white rounded-lg shadow-2xl p-4 mb-2 min-w-[280px] border border-gray-200"
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <h3 className="font-bold text-gray-800">版本資訊</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">版本:</span>
                  <span className="font-semibold text-gray-800">{getVersionString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">更新時間:</span>
                  <span className="font-mono text-xs text-gray-800">{getCommitTimeString()}</span>
                </div>

                <div className="pt-2 border-t">
                  <div className="text-gray-600 mb-1">更新內容:</div>
                  <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                    {VERSION_INFO.commitMessage}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 版本標籤按鈕 */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-semibold hover:shadow-xl transition-shadow flex items-center gap-1.5"
      >
        <span className="text-[10px] opacity-90">🔖</span>
        <span>{getVersionString()}</span>
      </motion.button>
    </div>
  )
}
