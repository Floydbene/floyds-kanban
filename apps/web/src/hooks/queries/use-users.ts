import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { ApiResponse, User } from '@taskflow/shared'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<ApiResponse<User[]>>('/api/auth/users').then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  })
}
