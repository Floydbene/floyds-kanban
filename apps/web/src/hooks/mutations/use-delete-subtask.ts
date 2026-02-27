import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

interface DeleteSubtaskInput {
  subtaskId: string
  taskId: string
}

export function useDeleteSubtask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ subtaskId }: DeleteSubtaskInput) =>
      api.delete(`/api/subtasks/${subtaskId}`),

    onMutate: async ({ subtaskId, taskId }) => {
      await queryClient.cancelQueries({ queryKey: ['subtasks', taskId] })

      const previous = queryClient.getQueryData<unknown[]>(['subtasks', taskId])

      queryClient.setQueryData<unknown[]>(['subtasks', taskId], (old) =>
        old?.filter((s: any) => s.id !== subtaskId),
      )

      return { previous, taskId }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['subtasks', context.taskId], context.previous)
      }
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', vars.taskId] })
      queryClient.invalidateQueries({ queryKey: ['task', vars.taskId] })
    },
  })
}
