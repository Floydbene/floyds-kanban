import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, Subtask } from '@taskflow/shared'

export function useSubtasks(taskId: string | null) {
  return useQuery({
    queryKey: ['subtasks', taskId],
    queryFn: () =>
      api.get<ApiResponse<Subtask[]>>(`/api/tasks/${taskId}/subtasks`).then((res) => res.data),
    enabled: !!taskId,
  })
}
