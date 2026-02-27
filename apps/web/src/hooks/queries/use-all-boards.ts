import { useQueries } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useProjects } from './use-projects'
import type { ApiResponse, BoardWithColumns } from '@taskflow/shared'

export function useAllBoards() {
  const { data: projects, isLoading: projectsLoading } = useProjects()

  const boardQueries = useQueries({
    queries: (projects ?? []).map((project) => ({
      queryKey: ['board', project.slug],
      queryFn: () =>
        api
          .get<ApiResponse<BoardWithColumns>>(`/api/projects/${project.slug}/board`)
          .then((res) => ({ board: res.data, project })),
      enabled: !projectsLoading && !!projects?.length,
    })),
  })

  const isLoading = projectsLoading || boardQueries.some((q) => q.isLoading)
  const boards = boardQueries
    .filter((q) => q.data)
    .map((q) => q.data!)

  return { boards, isLoading, projects }
}
