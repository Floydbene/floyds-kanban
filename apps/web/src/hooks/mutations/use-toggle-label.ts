import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

interface ToggleLabelInput {
  taskId: string
  labelId: string
  isActive: boolean
}

export function useToggleLabel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, labelId, isActive }: ToggleLabelInput) =>
      isActive
        ? api.delete(`/api/tasks/${taskId}/labels/${labelId}`)
        : api.post(`/api/tasks/${taskId}/labels/${labelId}`),

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ['task', vars.taskId] })
    },
  })
}
