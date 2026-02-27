import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'
import type { ApiResponse, TaskResource } from '@taskflow/shared'

interface CreateResourceInput {
  taskId: string
  title: string
  url: string
  resourceType?: string
}

export function useCreateResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, ...data }: CreateResourceInput) =>
      api.post<ApiResponse<TaskResource>>(`/api/tasks/${taskId}/resources`, data),

    onSuccess: () => {
      toast.success('Resource added')
    },
    onError: () => {
      toast.error('Failed to add resource')
    },
    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ['resources', vars.taskId] })
    },
  })
}
