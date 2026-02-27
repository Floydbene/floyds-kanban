import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

interface ReorderColumnsInput {
  boardId: string
  columns: { id: string; position: number }[]
}

export function useReorderColumns(projectSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ boardId, columns }: ReorderColumnsInput) =>
      api.patch(`/api/boards/${boardId}/columns/reorder`, { columns }),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectSlug] })
    },
  })
}
