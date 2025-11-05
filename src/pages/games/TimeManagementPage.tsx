import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { playSuccessMessage, playFailureMessage } from '@/utils/audioFeedback'

interface Task {
  id: number
  name: string
  duration: number // 分鐘
  priority: 'high' | 'medium' | 'low'
  deadline: number // 距離現在多少分鐘後截止
  points: number
  emoji: string
  completed: boolean
}

// 時間管理挑戰：在有限時間內完成高優先級任務
export const TimeManagementPage = () => {
  const navigate = useNavigate()
  const { ageGroup } = useSettingsStore()
  const { saveResult } = useGameStore()

  const [totalTime] = useState(60) // 總共 60 分鐘
  const [currentTime, setCurrentTime] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [maxRounds] = useState(5)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())
  const [gameOverReason, setGameOverReason] = useState<string>('')

  // 只允許 7-13 歲玩
  useEffect(() => {
    if (ageGroup === '4-6') {
      alert('這個遊戲只適合 7-13 歲的小朋友哦！')
      navigate(-1)
    }
  }, [ageGroup, navigate])

  useEffect(() => {
    generateTasks()
  }, [round])

  const generateTasks = () => {
    const taskTemplates = [
      { name: '完成數學作業', emoji: '📐', baseDuration: 15, basePriority: 'high' as const },
      { name: '閱讀課外書', emoji: '📚', baseDuration: 20, basePriority: 'medium' as const },
      { name: '整理房間', emoji: '🧹', baseDuration: 10, basePriority: 'low' as const },
      { name: '準備明天的課本', emoji: '📖', baseDuration: 5, basePriority: 'high' as const },
      { name: '練習鋼琴', emoji: '🎹', baseDuration: 30, basePriority: 'medium' as const },
      { name: '寫日記', emoji: '✍️', baseDuration: 10, basePriority: 'low' as const },
      { name: '完成美術作業', emoji: '🎨', baseDuration: 25, basePriority: 'high' as const },
      { name: '幫忙準備晚餐', emoji: '🍳', baseDuration: 15, basePriority: 'medium' as const },
      { name: '澆花', emoji: '🌱', baseDuration: 5, basePriority: 'low' as const },
      { name: '整理書桌', emoji: '🗂️', baseDuration: 10, basePriority: 'low' as const },
      { name: '複習英文單字', emoji: '🔤', baseDuration: 15, basePriority: 'high' as const },
      { name: '運動 20 分鐘', emoji: '⚽', baseDuration: 20, basePriority: 'medium' as const },
      { name: '完成科學實驗報告', emoji: '🔬', baseDuration: 20, basePriority: 'high' as const },
      { name: '練習書法', emoji: '🖌️', baseDuration: 15, basePriority: 'medium' as const },
      { name: '整理衣櫃', emoji: '👔', baseDuration: 15, basePriority: 'low' as const },
      { name: '洗碗', emoji: '🍽️', baseDuration: 10, basePriority: 'medium' as const },
      { name: '餵寵物', emoji: '🐕', baseDuration: 5, basePriority: 'high' as const },
      { name: '做手工藝', emoji: '✂️', baseDuration: 25, basePriority: 'low' as const },
      { name: '背詩詞', emoji: '📜', baseDuration: 15, basePriority: 'high' as const },
      { name: '打掃廁所', emoji: '🚽', baseDuration: 10, basePriority: 'low' as const },
      { name: '預習明天的課程', emoji: '📝', baseDuration: 20, basePriority: 'high' as const },
      { name: '整理玩具', emoji: '🧸', baseDuration: 10, basePriority: 'low' as const },
    ]

    // 隨機選擇 5-7 個任務
    const taskCount = 5 + Math.floor(Math.random() * 3)
    const shuffled = [...taskTemplates].sort(() => Math.random() - 0.5).slice(0, taskCount)

    const newTasks: Task[] = shuffled.map((template, index) => {
      // 隨機調整持續時間（±5 分鐘）
      const duration = Math.max(5, template.baseDuration + (Math.random() - 0.5) * 10)

      // 高優先級任務的截止時間較短
      let deadline: number
      if (template.basePriority === 'high') {
        deadline = 20 + Math.random() * 15 // 20-35 分鐘
      } else if (template.basePriority === 'medium') {
        deadline = 30 + Math.random() * 20 // 30-50 分鐘
      } else {
        deadline = 40 + Math.random() * 20 // 40-60 分鐘
      }

      // 分數根據優先級和持續時間
      let points: number
      if (template.basePriority === 'high') {
        points = 100
      } else if (template.basePriority === 'medium') {
        points = 60
      } else {
        points = 30
      }

      return {
        id: index,
        name: template.name,
        duration: Math.floor(duration),
        priority: template.basePriority,
        deadline: Math.floor(deadline),
        points,
        emoji: template.emoji,
        completed: false,
      }
    })

    setTasks(newTasks)
    setSelectedTask(null)
  }

  const doTask = (task: Task) => {
    if (currentTime + task.duration > totalTime) {
      // 時間不夠
      playFailureMessage()
      setGameOverReason('時間不夠了！')
      endGame()
      return
    }

    const newTime = currentTime + task.duration

    // 檢查是否在截止時間內完成
    let taskScore = 0
    if (newTime <= task.deadline) {
      // 在截止時間內完成，獲得全部分數
      taskScore = task.points
      playSuccessMessage()

      // 如果提前很多完成，額外獎勵
      if (newTime < task.deadline - 10) {
        taskScore += 20 // 提前獎勵
      }
    } else {
      // 超過截止時間，扣分
      const overtime = newTime - task.deadline
      taskScore = Math.max(0, task.points - overtime * 2)
      playFailureMessage()
    }

    setScore(score + taskScore)
    setCurrentTime(newTime)
    setCompletedTasks([...completedTasks, { ...task, completed: true }])
    setTasks(tasks.filter((t) => t.id !== task.id))
    setSelectedTask(null)

    // 檢查是否還有高優先級任務已過期
    const overdueHighPriority = tasks.filter(
      (t) => t.id !== task.id && t.priority === 'high' && newTime > t.deadline
    )

    if (overdueHighPriority.length > 0) {
      playFailureMessage()
      setGameOverReason('高優先級任務逾期！')
      endGame()
      return
    }

    // 檢查是否完成所有任務
    if (tasks.length === 1) {
      // 完成本回合
      if (round < maxRounds) {
        setRound(round + 1)
        setCurrentTime(0)
      } else {
        // 遊戲完成
        setIsComplete(true)
        playSuccessMessage()
        const duration = Date.now() - startTime

        saveResult({
          gameId: 'time-management',
          completed: true,
          score,
          duration,
        })
      }
    }
  }

  const skipTask = () => {
    if (!selectedTask) return

    // 跳過任務會失去一部分時間但不做任務
    const penaltyTime = 5
    const newTime = currentTime + penaltyTime

    if (newTime > totalTime) {
      setGameOverReason('時間用完了！')
      endGame()
      return
    }

    setCurrentTime(newTime)
    setSelectedTask(null)
  }

  const endGame = () => {
    setIsComplete(true)
    const duration = Date.now() - startTime

    saveResult({
      gameId: 'time-management',
      completed: false,
      score,
      duration,
    })
  }

  const restart = () => {
    setCurrentTime(0)
    setScore(0)
    setRound(1)
    setCompletedTasks([])
    setIsComplete(false)
    setGameOverReason('')
    generateTasks()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-400 text-red-800'
      case 'medium':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800'
      case 'low':
        return 'bg-green-100 border-green-400 text-green-800'
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高'
      case 'medium':
        return '中'
      case 'low':
        return '低'
      default:
        return '未知'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              ⏰ 時間管理挑戰
            </h1>
            <p className="text-gray-600">
              在有限時間內完成任務，優先處理重要且緊急的事！
            </p>
          </div>
          <Button variant="default" onClick={() => navigate(-1)}>
            ← 返回
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 狀態面板 */}
          <Card hoverScale={false} className="lg:col-span-3">
            <div className="flex flex-wrap gap-6 items-center justify-between">
              <div className="flex gap-6">
                <div>
                  <span className="text-sm text-gray-600">回合</span>
                  <p className="text-2xl font-bold">{round}/{maxRounds}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">時間</span>
                  <p className="text-2xl font-bold">{currentTime}/{totalTime} 分鐘</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">分數</span>
                  <p className="text-2xl font-bold text-purple-600">{score}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">完成任務</span>
                  <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
                </div>
              </div>
              <Button variant="default" size="sm" onClick={restart}>
                🔄 重新開始
              </Button>
            </div>

            {/* 時間進度條 */}
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    currentTime / totalTime > 0.8 ? 'bg-red-500' : currentTime / totalTime > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(currentTime / totalTime) * 100}%` }}
                />
              </div>
            </div>
          </Card>

          {/* 任務列表 */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">📋 待辦任務</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    本回合任務已全部完成！
                  </div>
                ) : (
                  tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Card
                        onClick={() => setSelectedTask(task)}
                        className={`
                          cursor-pointer
                          ${selectedTask?.id === task.id ? 'ring-4 ring-blue-400' : ''}
                          ${currentTime > task.deadline ? 'opacity-60' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-4xl">{task.emoji}</span>
                            <div>
                              <h3 className="font-bold text-lg">{task.name}</h3>
                              <div className="flex gap-3 text-sm text-gray-600">
                                <span>⏱️ {task.duration} 分鐘</span>
                                <span>⏰ 截止: {task.deadline} 分</span>
                                <span>⭐ {task.points} 分</span>
                              </div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getPriorityColor(task.priority)}`}>
                            優先級: {getPriorityLabel(task.priority)}
                          </div>
                        </div>
                        {currentTime > task.deadline && (
                          <div className="mt-2 text-red-600 text-sm font-bold">
                            ⚠️ 已逾期！
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 操作面板 */}
          <div>
            <h2 className="text-2xl font-bold mb-4">🎮 操作</h2>
            {selectedTask ? (
              <Card hoverScale={false} className="bg-blue-50">
                <h3 className="font-bold text-lg mb-2">已選擇任務</h3>
                <div className="mb-4">
                  <p className="text-3xl mb-2">{selectedTask.emoji}</p>
                  <p className="font-bold">{selectedTask.name}</p>
                  <p className="text-sm text-gray-600">需要 {selectedTask.duration} 分鐘</p>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="kids"
                    size="lg"
                    onClick={() => doTask(selectedTask)}
                    className="w-full"
                  >
                    ✅ 執行任務
                  </Button>
                  <Button
                    variant="default"
                    size="md"
                    onClick={skipTask}
                    className="w-full"
                  >
                    ⏭️ 跳過（-5 分鐘）
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setSelectedTask(null)}
                    className="w-full"
                  >
                    取消
                  </Button>
                </div>
              </Card>
            ) : (
              <Card hoverScale={false} className="bg-gray-50">
                <p className="text-center text-gray-500">
                  請選擇一個任務開始執行
                </p>
                <div className="mt-4 text-sm text-gray-600 space-y-2">
                  <p>💡 提示：</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>優先完成高優先級任務</li>
                    <li>注意任務的截止時間</li>
                    <li>提前完成有額外獎勵</li>
                    <li>逾期會扣分</li>
                  </ul>
                </div>
              </Card>
            )}

            {/* 已完成任務 */}
            {completedTasks.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">✅ 已完成</h3>
                <div className="space-y-1">
                  {completedTasks.slice(-3).map((task) => (
                    <div key={task.id} className="text-sm bg-green-50 p-2 rounded">
                      {task.emoji} {task.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 遊戲結束畫面 */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
              ${gameOverReason ? 'bg-gradient-to-r from-orange-400 to-red-400' : 'bg-gradient-to-r from-green-400 to-emerald-400'}
              text-white rounded-2xl p-8 text-center shadow-xl
            `}
          >
            <div className="text-6xl mb-4">{gameOverReason ? '⏰' : '🎉'}</div>
            <h2 className="text-3xl font-bold mb-2">
              {gameOverReason ? '遊戲結束' : '時間管理大師！'}
            </h2>
            <p className="text-xl mb-4">
              {gameOverReason || '你成功完成所有回合！'}
            </p>
            <div className="space-y-2 mb-6">
              <p>完成回合: <span className="font-bold">{round}/{maxRounds}</span></p>
              <p>完成任務: <span className="font-bold">{completedTasks.length}</span></p>
              <p className="text-2xl">最終分數: <span className="font-bold">{score}</span></p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="default" size="lg" onClick={restart}>
                再玩一次
              </Button>
              <Button variant="default" size="lg" onClick={() => navigate(-1)}>
                返回遊戲大廳
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
