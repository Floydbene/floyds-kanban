import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerState {
  activeTaskId: string | null
  startedAt: string | null
  isRunning: boolean
  elapsed: number
  start: (taskId: string) => void
  stop: () => void
  reset: () => void
  tick: () => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      activeTaskId: null,
      startedAt: null,
      isRunning: false,
      elapsed: 0,
      start: (taskId) =>
        set({
          activeTaskId: taskId,
          startedAt: new Date().toISOString(),
          isRunning: true,
          elapsed: 0,
        }),
      stop: () => set({ isRunning: false }),
      reset: () => set({ activeTaskId: null, startedAt: null, isRunning: false, elapsed: 0 }),
      tick: () => {
        const { startedAt, isRunning } = get()
        if (isRunning && startedAt) {
          set({ elapsed: Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000) })
        }
      },
    }),
    { name: 'taskflow-timer' },
  ),
)
