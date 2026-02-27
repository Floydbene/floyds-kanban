import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { Comment } from '@taskflow/shared'

interface DeleteCommentInput {
  commentId: string
  taskId: string
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId }: DeleteCommentInput) =>
      api.delete(`/api/comments/${commentId}`),

    onMutate: async ({ commentId, taskId }) => {
      await queryClient.cancelQueries({ queryKey: ['comments', taskId] })

      const previous = queryClient.getQueryData<Comment[]>(['comments', taskId])

      queryClient.setQueryData<Comment[]>(['comments', taskId], (old) =>
        old?.filter((c) => c.id !== commentId),
      )

      return { previous, taskId }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['comments', context.taskId], context.previous)
      }
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ['comments', vars.taskId] })
    },
  })
}
