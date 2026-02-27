import { useMemo } from 'react'
import { useAllBoards } from '@/hooks/queries/use-all-boards'
import { Skeleton } from '@/components/ui/skeleton'
import { KanbanCard } from './kanban-card'
import type { TaskWithRelations } from '@taskflow/shared'

interface MergedTask extends TaskWithRelations {
  projectName: string
  projectColor: string
}

interface MergedColumn {
  name: string
  color: string | null
  tasks: MergedTask[]
}

export function CombinedKanban() {
  const { boards, isLoading } = useAllBoards()

  const mergedColumns = useMemo(() => {
    if (!boards.length) return []

    const columnMap = new Map<string, MergedColumn>()
    const columnOrder: string[] = []

    for (const { board, project } of boards) {
      const sorted = [...board.columns].sort((a, b) => a.position - b.position)
      for (const col of sorted) {
        const key = col.name.toLowerCase()
        if (!columnMap.has(key)) {
          columnMap.set(key, {
            name: col.name,
            color: col.color,
            tasks: [],
          })
          columnOrder.push(key)
        }
        const merged = columnMap.get(key)!
        for (const task of col.tasks) {
          merged.tasks.push({
            ...task,
            projectName: project.name,
            projectColor: project.color,
          })
        }
      }
    }

    return columnOrder.map((key) => columnMap.get(key)!)
  }, [boards])

  if (isLoading) {
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

  if (!mergedColumns.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No tasks across projects yet</p>
      </div>
    )
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto p-6">
      {mergedColumns.map((col) => (
        <div key={col.name} className="flex w-72 shrink-0 flex-col">
          <div className="mb-3 flex items-center gap-2 px-1">
            {col.color && (
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.color }} />
            )}
            <h3 className="text-sm font-semibold">{col.name}</h3>
            <span className="text-xs text-muted-foreground">{col.tasks.length}</span>
          </div>

          <div className="flex flex-1 flex-col gap-2 rounded-lg p-1.5">
            {col.tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                projectName={task.projectName}
                projectColor={task.projectColor}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
