import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'
import type { ApiResponse, BoardWithColumns, Task } from '@taskflow/shared'

interface MoveTaskInput {
  taskId: string
  columnId: string
  position: number
}

export function useMoveTask(projectSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, columnId, position }: MoveTaskInput) =>
      api.patch<ApiResponse<Task>>(`/api/tasks/${taskId}/move`, { columnId, position }),

    onMutate: async ({ taskId, columnId, position }) => {
      await queryClient.cancelQueries({ queryKey: ['board', projectSlug] })

      const previous = queryClient.getQueryData<BoardWithColumns>(['board', projectSlug])

      queryClient.setQueryData<BoardWithColumns>(['board', projectSlug], (old) => {
        if (!old) return old

        const columns = old.columns.map((col) => ({
          ...col,
          tasks: col.tasks.filter((t) => t.id !== taskId),
        }))

        const sourceCol = old.columns.find((col) => col.tasks.some((t) => t.id === taskId))
        const task = sourceCol?.tasks.find((t) => t.id === taskId)
        if (!task) return old

        const targetCol = columns.find((col) => col.id === columnId)
        if (!targetCol) return old

        const movedTask = { ...task, columnId, position }
        targetCol.tasks.splice(position, 0, movedTask)
        targetCol.tasks = targetCol.tasks.map((t, i) => ({ ...t, position: i }))

        return { ...old, columns }
      })

      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['board', projectSlug], context.previous)
      }
      toast.error('Failed to move task')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectSlug] })
    },
  })
}
