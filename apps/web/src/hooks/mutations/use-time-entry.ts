import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, TimeEntry } from '@taskflow/shared'

export function useStartTimer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) =>
      api.post<ApiResponse<{ taskId: string }>>('/api/time-entries/start', { taskId }),

    onSettled: (_data, _err, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['time-entries', 'active'] })
      queryClient.invalidateQueries({ queryKey: ['time-entries', taskId] })
    },
  })
}

export function useStopTimer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.post<ApiResponse<TimeEntry>>('/api/time-entries/stop'),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] })
    },
  })
}
