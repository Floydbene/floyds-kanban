import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'
import type { ApiResponse, Comment } from '@taskflow/shared'

interface CreateCommentInput {
  taskId: string
  content: string
}

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, content }: CreateCommentInput) =>
      api.post<ApiResponse<Comment>>(`/api/tasks/${taskId}/comments`, { content }),

    onSuccess: () => {
      toast.success('Comment added')
    },
    onError: () => {
      toast.error('Failed to add comment')
    },
    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ['comments', vars.taskId] })
    },
  })
}
