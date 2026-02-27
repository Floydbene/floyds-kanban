import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'
import type { ApiResponse, Project } from '@taskflow/shared'

interface CreateProjectInput {
  name: string
  description?: string
  color: string
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateProjectInput) =>
      api.post<ApiResponse<Project>>('/api/projects', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created')
    },
    onError: () => {
      toast.error('Failed to create project')
    },
  })
}
