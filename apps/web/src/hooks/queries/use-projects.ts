import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, ProjectWithTags } from '@taskflow/shared'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get<ApiResponse<ProjectWithTags[]>>('/api/projects').then((res) => res.data),
  })
}
