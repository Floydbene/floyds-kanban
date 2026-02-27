import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'
import type { ApiResponse, ProjectWithTags } from '@taskflow/shared'

interface UpdateProjectInput {
  slug: string
  name?: string
  description?: string
  color?: string
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, ...data }: UpdateProjectInput) =>
      api.patch<ApiResponse<ProjectWithTags>>(`/api/projects/${slug}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project updated')
    },
    onError: () => {
      toast.error('Failed to update project')
    },
  })
}
