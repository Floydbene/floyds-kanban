import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'
import type { ApiResponse, ProjectTag } from '@taskflow/shared'

export function useCreateProjectTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { name: string; color: string }) =>
      api.post<ApiResponse<ProjectTag>>('/api/tags', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tags'] })
      toast.success('Tag created')
    },
    onError: () => {
      toast.error('Failed to create tag')
    },
  })
}

export function useDeleteProjectTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/tags/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tags'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Tag deleted')
    },
    onError: () => {
      toast.error('Failed to delete tag')
    },
  })
}
