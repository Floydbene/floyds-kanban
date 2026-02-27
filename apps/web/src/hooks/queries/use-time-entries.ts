import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, TimeEntry } from '@taskflow/shared'

export function useTimeEntries(taskId: string | null) {
  return useQuery({
    queryKey: ['time-entries', taskId],
    queryFn: () =>
      api.get<ApiResponse<TimeEntry[]>>(`/api/tasks/${taskId}/time-entries`).then((res) => res.data),
    enabled: !!taskId,
  })
}

export function useActiveTimeEntry() {
  return useQuery({
    queryKey: ['time-entries', 'active'],
    queryFn: () =>
      api.get<ApiResponse<TimeEntry | null>>('/api/time-entries/active').then((res) => res.data),
    refetchInterval: 30000,
  })
}
