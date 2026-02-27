import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, Column } from '@taskflow/shared'

export function useUpdateColumn(projectSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ columnId, ...data }: { columnId: string } & Partial<Column>) =>
      api.patch<ApiResponse<Column>>(`/api/columns/${columnId}`, data),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectSlug] })
    },
  })
}
