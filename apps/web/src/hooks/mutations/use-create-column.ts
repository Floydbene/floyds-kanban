import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, Column } from '@taskflow/shared'

interface CreateColumnInput {
  boardId: string
  name: string
  color?: string
}

export function useCreateColumn(projectSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateColumnInput) =>
      api.post<ApiResponse<Column>>('/api/columns', input),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectSlug] })
    },
  })
}
