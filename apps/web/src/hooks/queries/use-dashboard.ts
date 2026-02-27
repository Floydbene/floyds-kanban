import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type {
  ApiResponse,
  DashboardSummary,
  ThroughputDataPoint,
  CycleTimeDataPoint,
  DistributionItem,
} from '@taskflow/shared'

export function useSummary(projectId?: string) {
  const params = projectId ? `?projectId=${projectId}` : ''
  return useQuery({
    queryKey: ['dashboard', 'summary', projectId],
    queryFn: () => api.get<ApiResponse<DashboardSummary>>(`/api/dashboard/summary${params}`).then((res) => res.data),
  })
}

export function useThroughput(projectId?: string) {
  const params = projectId ? `?projectId=${projectId}` : ''
  return useQuery({
    queryKey: ['dashboard', 'throughput', projectId],
    queryFn: () =>
      api.get<ApiResponse<ThroughputDataPoint[]>>(`/api/dashboard/throughput${params}`).then((res) => res.data),
  })
}

export function useCycleTime(projectId?: string) {
  const params = projectId ? `?projectId=${projectId}` : ''
  return useQuery({
    queryKey: ['dashboard', 'cycle-time', projectId],
    queryFn: () =>
      api.get<ApiResponse<CycleTimeDataPoint[]>>(`/api/dashboard/cycle-time${params}`).then((res) => res.data),
  })
}

export function usePriorityDistribution(projectId?: string) {
  const params = projectId ? `?projectId=${projectId}` : ''
  return useQuery({
    queryKey: ['dashboard', 'priority-distribution', projectId],
    queryFn: () =>
      api.get<ApiResponse<DistributionItem[]>>(`/api/dashboard/priority-distribution${params}`).then((res) => res.data),
  })
}

export function useLabelDistribution(projectId?: string) {
  const params = projectId ? `?projectId=${projectId}` : ''
  return useQuery({
    queryKey: ['dashboard', 'label-distribution', projectId],
    queryFn: () =>
      api.get<ApiResponse<DistributionItem[]>>(`/api/dashboard/label-distribution${params}`).then((res) => res.data),
  })
}
