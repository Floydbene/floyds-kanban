import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, Label } from '@taskflow/shared'

export function useLabels(projectSlug: string) {
  return useQuery({
    queryKey: ['labels', projectSlug],
    queryFn: () => api.get<ApiResponse<Label[]>>(`/api/projects/${projectSlug}/labels`).then((res) => res.data),
    enabled: !!projectSlug,
  })
}
