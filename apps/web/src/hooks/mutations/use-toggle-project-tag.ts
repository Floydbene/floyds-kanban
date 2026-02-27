import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'

export function useToggleProjectTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectSlug, tagId, assigned }: { projectSlug: string; tagId: string; assigned: boolean }) => {
      if (assigned) {
        return api.delete(`/api/projects/${projectSlug}/tags/${tagId}`)
      }
      return api.post(`/api/projects/${projectSlug}/tags/${tagId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: () => {
      toast.error('Failed to update tag')
    },
  })
}
