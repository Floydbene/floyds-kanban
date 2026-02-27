import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, BoardWithColumns } from '@taskflow/shared'

export function useBoard(projectSlug: string) {
  return useQuery({
    queryKey: ['board', projectSlug],
    queryFn: () =>
      api.get<ApiResponse<BoardWithColumns>>(`/api/projects/${projectSlug}/board`).then((res) => res.data),
    enabled: !!projectSlug,
  })
}
