import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@/lib/utils'
import { ColumnHeader } from './column-header'
import { KanbanCard } from './kanban-card'
import { AddCardInline } from './add-card-inline'
import { SortableItem } from './sortable-item'
import type { ColumnWithTasks, TaskType } from '@taskflow/shared'

interface KanbanColumnProps {
  column: ColumnWithTasks
  onCreateTask: (title: string, columnId: string, type: TaskType) => void
  onRenameColumn: (columnId: string, name: string) => void
  onSetWipLimit: (columnId: string, limit: number | null) => void
  onToggleDoneColumn: (columnId: string, isDone: boolean) => void
  onToggleBlockedColumn: (columnId: string, isBlocked: boolean) => void
  onToggleCollapse: (columnId: string, isCollapsed: boolean) => void
  onDeleteColumn: (columnId: string) => void
}

export function KanbanColumn({
  column,
  onCreateTask,
  onRenameColumn,
  onSetWipLimit,
  onToggleDoneColumn,
  onToggleBlockedColumn,
  onToggleCollapse,
  onDeleteColumn,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  const taskIds = column.tasks.map((t) => t.id)
  const isOverWipLimit = column.wipLimit !== null && column.tasks.length > column.wipLimit

  if (column.isCollapsed) {
    return (
      <div
        className={cn(
          'flex h-full w-10 shrink-0 cursor-pointer flex-col items-center gap-2 rounded-lg border px-1 py-3 transition-colors',
          column.isBlockedColumn
            ? 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10'
            : 'bg-muted/30 hover:bg-muted/50',
        )}
        onClick={() => onToggleCollapse(column.id, false)}
      >
        {column.color && (
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: column.color }} />
        )}
        {!column.color && column.isBlockedColumn && (
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
        )}
        <span className={cn(
          'text-xs font-medium [writing-mode:vertical-lr]',
          column.isBlockedColumn ? 'text-red-400' : 'text-muted-foreground',
        )}>
          {column.name}
        </span>
        <span className="text-xs text-muted-foreground">{column.tasks.length}</span>
      </div>
    )
  }

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <ColumnHeader
        column={column}
        taskCount={column.tasks.length}
        onRename={(name) => onRenameColumn(column.id, name)}
        onSetWipLimit={(limit) => onSetWipLimit(column.id, limit)}
        onToggleDoneColumn={() => onToggleDoneColumn(column.id, !column.isDoneColumn)}
        onToggleBlockedColumn={() => onToggleBlockedColumn(column.id, !column.isBlockedColumn)}
        onToggleCollapse={() => onToggleCollapse(column.id, true)}
        onDelete={() => onDeleteColumn(column.id)}
      />

      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-[120px] flex-1 flex-col gap-2 rounded-lg p-1.5 transition-all',
          isOver && 'border border-dotted border-muted-foreground/40 bg-accent/10',
          isOverWipLimit && 'border border-dashed border-destructive/40',
          column.isBlockedColumn && !isOver && 'border border-dashed border-red-500/30',
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task) => (
            <SortableItem key={task.id} id={task.id}>
              {({ setNodeRef, attributes, listeners, style, isDragging }) => (
                <KanbanCard
                  ref={setNodeRef}
                  task={task}
                  isDragging={isDragging}
                  style={style}
                  attributes={attributes}
                  listeners={listeners}
                />
              )}
            </SortableItem>
          ))}
        </SortableContext>

        <AddCardInline onAdd={(title, type) => onCreateTask(title, column.id, type)} />
      </div>
    </div>
  )
}
