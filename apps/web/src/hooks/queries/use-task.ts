import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, TaskWithRelations } from '@taskflow/shared'

export function useTask(taskId: string | null) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () =>
      api.get<ApiResponse<TaskWithRelations>>(`/api/tasks/${taskId}`).then((res) => res.data),
    enabled: !!taskId,
  })
}
