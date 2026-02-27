import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, Subtask } from '@taskflow/shared'

interface UpdateSubtaskInput {
  subtaskId: string
  taskId: string
  title?: string
  isCompleted?: boolean
}

export function useUpdateSubtask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ subtaskId, ...data }: UpdateSubtaskInput) =>
      api.patch<ApiResponse<Subtask>>(`/api/subtasks/${subtaskId}`, data),

    onMutate: async ({ subtaskId, taskId, ...updates }) => {
      await queryClient.cancelQueries({ queryKey: ['subtasks', taskId] })

      const previous = queryClient.getQueryData<Subtask[]>(['subtasks', taskId])

      queryClient.setQueryData<Subtask[]>(['subtasks', taskId], (old) =>
        old?.map((s) => (s.id === subtaskId ? { ...s, ...updates } : s)),
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
