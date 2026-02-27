import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { TaskResource } from '@taskflow/shared'

interface DeleteResourceInput {
  resourceId: string
  taskId: string
}

export function useDeleteResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ resourceId }: DeleteResourceInput) =>
      api.delete(`/api/resources/${resourceId}`),

    onMutate: async ({ resourceId, taskId }) => {
      await queryClient.cancelQueries({ queryKey: ['resources', taskId] })

      const previous = queryClient.getQueryData<TaskResource[]>(['resources', taskId])

      queryClient.setQueryData<TaskResource[]>(['resources', taskId], (old) =>
        old?.filter((r) => r.id !== resourceId),
      )

      return { previous, taskId }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['resources', context.taskId], context.previous)
      }
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ['resources', vars.taskId] })
    },
  })
}
