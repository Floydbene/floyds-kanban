import { useState, useCallback, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useBoard } from '@/hooks/queries/use-board'
import { useMoveTask } from '@/hooks/mutations/use-move-task'
import { useCreateTask } from '@/hooks/mutations/use-create-task'
import { useCreateColumn } from '@/hooks/mutations/use-create-column'
import { useUpdateColumn } from '@/hooks/mutations/use-update-column'
import { useDeleteColumn } from '@/hooks/mutations/use-delete-column'
import { useUpdateTask } from '@/hooks/mutations/use-update-task'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { KanbanColumn } from './kanban-column'
import { KanbanCard } from './kanban-card'
import type { BoardWithColumns, TaskType } from '@taskflow/shared'
import { useQueryClient } from '@tanstack/react-query'

interface KanbanBoardProps {
  projectSlug: string
}

export function KanbanBoard({ projectSlug }: KanbanBoardProps) {
  const { data: board, isLoading, isFetching } = useBoard(projectSlug)
  const moveTask = useMoveTask(projectSlug)
  const createTask = useCreateTask(projectSlug)
  const createColumn = useCreateColumn(projectSlug)
  const updateColumn = useUpdateColumn(projectSlug)
  const deleteColumn = useDeleteColumn(projectSlug)
  const updateTask = useUpdateTask(projectSlug)
  const queryClient = useQueryClient()

  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const activeTask = useMemo(() => {
    if (!activeId || !board) return null
    for (const col of board.columns) {
      const task = col.tasks.find((t) => t.id === activeId)
      if (task) return task
    }
    return null
  }, [activeId, board])

  const findColumnByTaskId = useCallback(
    (taskId: string): string | undefined => {
      if (!board) return undefined
      for (const col of board.columns) {
        if (col.tasks.some((t) => t.id === taskId)) return col.id
      }
      return undefined
    },
    [board],
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over || !board) return

      const activeColId = findColumnByTaskId(active.id as string)
      // over could be a task or a column
      let overColId = findColumnByTaskId(over.id as string)
      if (!overColId) {
        // over is a column id directly
        if (board.columns.some((c) => c.id === over.id)) {
          overColId = over.id as string
        }
      }

      if (!activeColId || !overColId || activeColId === overColId) return

      // Optimistically move task between columns in cache during drag
      queryClient.setQueryData<BoardWithColumns>(['board', projectSlug], (old) => {
        if (!old) return old

        const activeCol = old.columns.find((c) => c.id === activeColId)
        const overCol = old.columns.find((c) => c.id === overColId)
        if (!activeCol || !overCol) return old

        const taskIndex = activeCol.tasks.findIndex((t) => t.id === active.id)
        if (taskIndex === -1) return old

        const [task] = activeCol.tasks.splice(taskIndex, 1)

        // Find position in the target column
        const overTaskIndex = overCol.tasks.findIndex((t) => t.id === over.id)
        const insertIndex = overTaskIndex >= 0 ? overTaskIndex : overCol.tasks.length

        overCol.tasks.splice(insertIndex, 0, { ...task, columnId: overColId! })

        return {
          ...old,
          columns: old.columns.map((c) => {
            if (c.id === activeColId) return { ...c, tasks: [...activeCol.tasks] }
            if (c.id === overColId) return { ...c, tasks: [...overCol.tasks] }
            return c
          }),
        }
      })
    },
    [board, findColumnByTaskId, queryClient, projectSlug],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)

      if (!over || !board) return

      const activeTaskId = active.id as string
      let overColId = findColumnByTaskId(over.id as string)
      if (!overColId) {
        if (board.columns.some((c) => c.id === over.id)) {
          overColId = over.id as string
        }
      }
      if (!overColId) return

      const targetCol = board.columns.find((c) => c.id === overColId)
      if (!targetCol) return

      const position = targetCol.tasks.findIndex((t) => t.id === activeTaskId)
      const finalPosition = position >= 0 ? position : targetCol.tasks.length

      // If dropping into a blocked column, prompt for a reason
      if (targetCol.isBlockedColumn) {
        const reason = prompt('Why is this task blocked?')
        if (!reason?.trim()) {
          // User cancelled — revert the optimistic move
          queryClient.invalidateQueries({ queryKey: ['board', projectSlug] })
          return
        }
        moveTask.mutate(
          { taskId: activeTaskId, columnId: overColId, position: finalPosition },
          {
            onSuccess: () => {
              updateTask.mutate({ taskId: activeTaskId, blockedReason: reason.trim() } as any)
            },
          },
        )
        return
      }

      moveTask.mutate({ taskId: activeTaskId, columnId: overColId, position: finalPosition })
    },
    [board, findColumnByTaskId, moveTask, updateTask, queryClient, projectSlug],
  )

  const handleCreateTask = useCallback(
    (title: string, columnId: string, type?: TaskType) => {
      createTask.mutate({ title, columnId, type })
    },
    [createTask],
  )

  const handleAddColumn = useCallback(() => {
    if (!board) return
    const name = prompt('Column name:')
    if (!name?.trim()) return
    createColumn.mutate({ boardId: board.id, name: name.trim() })
  }, [board, createColumn])

  const handleRenameColumn = useCallback(
    (columnId: string, name: string) => {
      updateColumn.mutate({ columnId, name })
    },
    [updateColumn],
  )

  const handleSetWipLimit = useCallback(
    (columnId: string, limit: number | null) => {
      updateColumn.mutate({ columnId, wipLimit: limit })
    },
    [updateColumn],
  )

  const handleToggleDoneColumn = useCallback(
    (columnId: string, isDoneColumn: boolean) => {
      updateColumn.mutate({ columnId, isDoneColumn })
    },
    [updateColumn],
  )

  const handleToggleBlockedColumn = useCallback(
    (columnId: string, isBlockedColumn: boolean) => {
      updateColumn.mutate({ columnId, isBlockedColumn })
    },
    [updateColumn],
  )

  const handleToggleCollapse = useCallback(
    (columnId: string, isCollapsed: boolean) => {
      updateColumn.mutate({ columnId, isCollapsed })
    },
    [updateColumn],
  )

  const handleDeleteColumn = useCallback(
    (columnId: string) => {
      deleteColumn.mutate(columnId)
    },
    [deleteColumn],
  )

  if (isLoading || (isFetching && !board?.columns)) {
    return (
      <div className="flex gap-4 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-72 shrink-0">
            <Skeleton className="mb-3 h-8 w-32 rounded-md" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-24 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!board || !board.columns) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Board not found</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto p-6">
        {board.columns
          .sort((a, b) => a.position - b.position)
          .map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onCreateTask={handleCreateTask}
              onRenameColumn={handleRenameColumn}
              onSetWipLimit={handleSetWipLimit}
              onToggleDoneColumn={handleToggleDoneColumn}
              onToggleBlockedColumn={handleToggleBlockedColumn}
              onToggleCollapse={handleToggleCollapse}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}

        <div className="flex shrink-0 items-start pt-0.5">
          <Button
            variant="ghost"
            className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={handleAddColumn}
          >
            <Plus className="h-4 w-4" />
            Add column
          </Button>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
