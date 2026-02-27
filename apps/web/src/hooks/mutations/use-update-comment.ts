import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, Comment } from '@taskflow/shared'

interface UpdateCommentInput {
  commentId: string
  taskId: string
  content: string
}

export function useUpdateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, content }: UpdateCommentInput) =>
      api.patch<ApiResponse<Comment>>(`/api/comments/${commentId}`, { content }),

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ['comments', vars.taskId] })
    },
  })
}
