import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { PaginatedResponse, TaskWithRelations, TaskPriority } from '@taskflow/shared'

interface UseTasksOptions {
  projectSlug: string
  search?: string
  priorities?: TaskPriority[]
  labels?: string[]
  page?: number
  pageSize?: number
}

export function useTasks({ projectSlug, search, priorities, labels, page = 1, pageSize = 50 }: UseTasksOptions) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('pageSize', String(pageSize))
  if (search) params.set('search', search)
  if (priorities?.length) params.set('priority', priorities.join(','))
  if (labels?.length) params.set('labels', labels.join(','))

  return useQuery({
    queryKey: ['tasks', projectSlug, { search, priorities, labels, page, pageSize }],
    queryFn: () =>
      api.get<PaginatedResponse<TaskWithRelations>>(
        `/api/projects/${projectSlug}/tasks?${params.toString()}`,
      ),
    enabled: !!projectSlug,
  })
}
