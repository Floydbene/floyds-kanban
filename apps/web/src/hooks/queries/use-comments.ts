import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, Comment } from '@taskflow/shared'

export function useComments(taskId: string | null) {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: () =>
      api.get<ApiResponse<Comment[]>>(`/api/tasks/${taskId}/comments`).then((res) => res.data),
    enabled: !!taskId,
  })
}
