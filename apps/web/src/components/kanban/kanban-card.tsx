import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUiStore } from '@/stores/ui-store'
import type { TaskWithRelations, TaskPriority } from '@taskflow/shared'
import { Archive, Ban, Bug, Calendar, CheckCircle2, CheckSquare, Copy, GitBranch, SearchX, ShieldAlert, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'

function formatTimeRemaining(dueDate: string): string {
  const now = Date.now()
  const due = new Date(dueDate).getTime()
  const diff = due - now

  const absDiff = Math.abs(diff)
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))

  const suffix = diff < 0 ? ' ago' : ''

  if (days > 0) return `${days}d ${hours}h${suffix}`
  if (hours > 0) return `${hours}h ${minutes}m${suffix}`
  return `${minutes}m${suffix}`
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
}

interface KanbanCardProps {
  task: TaskWithRelations
  isDragging?: boolean
  isOverlay?: boolean
  style?: React.CSSProperties
  attributes?: Record<string, unknown>
  listeners?: Record<string, unknown>
  projectName?: string
  projectColor?: string
}

export const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>(
  ({ task, isDragging, isOverlay, style, attributes, listeners, projectName, projectColor, ...props }, ref) => {
    const openTask = useUiStore((s) => s.openTask)

    const completedSubtasks = task._count?.completedSubtasks ?? task.subtasks.filter((s) => s.isCompleted).length
    const totalSubtasks = task._count?.subtasks ?? task.subtasks.length

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completedAt

    const resolutionIndicator = task.resolution && task.resolution !== 'done'
      ? {
          wont_do: { icon: Ban, color: 'text-slate-400' },
          duplicate: { icon: Copy, color: 'text-orange-500' },
          cannot_reproduce: { icon: SearchX, color: 'text-purple-500' },
          obsolete: { icon: Archive, color: 'text-slate-400' },
        }[task.resolution]
      : null
    const ResolutionIcon = resolutionIndicator?.icon

    return (
      <motion.div
        ref={ref}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => openTask(task.id)}
        whileHover={!isDragging && !isOverlay ? { scale: 1.02 } : undefined}
        transition={{ duration: 0.15 }}
        className={cn(
          'cursor-pointer rounded-lg border bg-card p-3 transition-shadow',
          'hover:border-border/80 hover:shadow-md',
          isDragging && 'opacity-40',
          isOverlay && 'rotate-2 shadow-xl border-primary/50',
          task.isBlocked && 'border-red-500/60 bg-red-500/5',
        )}
        {...props}
      >
        {task.labels.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {task.labels.map((label) => (
              <div
                key={label.id}
                className="h-1.5 w-6 rounded-full"
                style={{ backgroundColor: label.color }}
                title={label.name}
              />
            ))}
          </div>
        )}

        {projectName && (
          <div className="mb-1.5 flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: projectColor }} />
            <span className="text-[10px] font-medium text-muted-foreground">{projectName}</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {task.type === 'task' && <CheckCircle2 className="mr-1 inline h-3 w-3 text-blue-500" />}
          {task.type === 'bug' && <Bug className="mr-1 inline h-3 w-3 text-red-500" />}
          {task.type === 'spike' && <Zap className="mr-1 inline h-3 w-3 text-amber-500" />}
          {task.type === 'subtask' && <GitBranch className="mr-1 inline h-3 w-3 text-slate-400" />}
          {task.identifier}
        </p>
        <p className={cn('mt-0.5 text-sm font-medium leading-snug', resolutionIndicator && 'line-through text-muted-foreground')}>
          {task.title}
          {ResolutionIcon && <ResolutionIcon className={cn('ml-1.5 inline h-3 w-3', resolutionIndicator.color)} />}
        </p>

        {task.isBlocked && (
          <div
            className="mt-1.5 flex items-center gap-1 rounded bg-red-500/15 px-1.5 py-0.5"
            title={task.blockedReason ?? 'Blocked'}
          >
            <ShieldAlert className="h-3 w-3 text-red-400" />
            <span className="truncate text-[10px] font-medium text-red-400">
              {task.blockedReason ?? 'Blocked'}
            </span>
          </div>
        )}

        <div className="mt-2 flex items-center gap-3">
          <div
            className={cn('h-2 w-2 rounded-full', PRIORITY_COLORS[task.priority])}
            title={task.priority}
          />

          {task.dueDate && (
            <span
              className={cn(
                'flex items-center gap-1 text-xs',
                isOverdue ? 'text-destructive' : 'text-muted-foreground',
              )}
              title={new Date(task.dueDate).toLocaleString()}
            >
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
              {!task.completedAt && (
                <span className={cn('text-[10px]', isOverdue ? 'text-destructive' : 'text-muted-foreground/70')}>
                  ({formatTimeRemaining(task.dueDate)})
                </span>
              )}
            </span>
          )}

          {totalSubtasks > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckSquare className="h-3 w-3" />
              {completedSubtasks}/{totalSubtasks}
            </span>
          )}

          {task.assignee && (
            <div className="ml-auto">
              <Avatar className="h-5 w-5" title={task.assignee.name}>
                <AvatarImage src={task.assignee.avatarUrl ?? undefined} alt={task.assignee.name} />
                <AvatarFallback className="text-[8px]">
                  {task.assignee.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </motion.div>
    )
  },
)
KanbanCard.displayName = 'KanbanCard'
