import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, ProjectTag } from '@taskflow/shared'

export function useProjectTags() {
  return useQuery({
    queryKey: ['project-tags'],
    queryFn: () => api.get<ApiResponse<ProjectTag[]>>('/api/tags').then((res) => res.data),
  })
}
