import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, TaskWithRelations } from '@taskflow/shared'

export function useUpdateTask(projectSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, ...data }: { taskId: string } & Partial<TaskWithRelations>) =>
      api.patch<ApiResponse<TaskWithRelations>>(`/api/tasks/${taskId}`, data),

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ['board', projectSlug] })
      queryClient.invalidateQueries({ queryKey: ['task', vars.taskId] })
    },
  })
}
