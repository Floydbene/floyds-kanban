import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, TaskResource } from '@taskflow/shared'

export function useResources(taskId: string | null) {
  return useQuery({
    queryKey: ['resources', taskId],
    queryFn: () =>
      api.get<ApiResponse<TaskResource[]>>(`/api/tasks/${taskId}/resources`).then((res) => res.data),
    enabled: !!taskId,
  })
}
