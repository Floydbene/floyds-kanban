import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'
import type { ApiResponse, BoardWithColumns, TaskWithRelations, TaskPriority, TaskType } from '@taskflow/shared'

interface CreateTaskInput {
  title: string
  columnId: string
  priority?: TaskPriority
  type?: TaskType
  description?: string
}

export function useCreateTask(projectSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTaskInput) =>
      api.post<ApiResponse<TaskWithRelations>>('/api/tasks', input),

    onMutate: async ({ title, columnId }) => {
      await queryClient.cancelQueries({ queryKey: ['board', projectSlug] })

      const previous = queryClient.getQueryData<BoardWithColumns>(['board', projectSlug])

      queryClient.setQueryData<BoardWithColumns>(['board', projectSlug], (old) => {
        if (!old) return old

        const placeholder: TaskWithRelations = {
          id: `temp-${Date.now()}`,
          title,
          description: null,
          identifier: '...',
          priority: 'medium',
          type: 'task',
          parentId: null,
          columnId,
          projectId: '',
          position: 999,
          dueDate: null,
          completedAt: null,
          resolution: null,
          estimatePoints: null,
          isBlocked: false,
          blockedReason: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          requestorId: null,
          assigneeId: null,
          requestor: null,
          assignee: null,
          labels: [],
          subtasks: [],
        }

        return {
          ...old,
          columns: old.columns.map((col) =>
            col.id === columnId ? { ...col, tasks: [...col.tasks, placeholder] } : col,
          ),
        }
      })

      return { previous }
    },

    onSuccess: () => {
      toast.success('Task created')
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['board', projectSlug], context.previous)
      }
      toast.error('Failed to create task')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectSlug] })
    },
  })
}
