import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, Subtask } from '@taskflow/shared'

interface CreateSubtaskInput {
  taskId: string
  title: string
}

export function useCreateSubtask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, title }: CreateSubtaskInput) =>
      api.post<ApiResponse<Subtask>>(`/api/tasks/${taskId}/subtasks`, { title }),

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', vars.taskId] })
      queryClient.invalidateQueries({ queryKey: ['task', vars.taskId] })
    },
  })
}
