import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { BoardWithColumns } from '@taskflow/shared'

export function useDeleteTask(projectSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => api.delete(`/api/tasks/${taskId}`),

    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['board', projectSlug] })

      const previous = queryClient.getQueryData<BoardWithColumns>(['board', projectSlug])

      queryClient.setQueryData<BoardWithColumns>(['board', projectSlug], (old) => {
        if (!old) return old
        return {
          ...old,
          columns: old.columns.map((col) => ({
            ...col,
            tasks: col.tasks.filter((t) => t.id !== taskId),
          })),
        }
      })

      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['board', projectSlug], context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectSlug] })
    },
  })
}
