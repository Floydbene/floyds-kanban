import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

export function useDeleteColumn(projectSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (columnId: string) => api.delete(`/api/columns/${columnId}`),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectSlug] })
    },
  })
}
