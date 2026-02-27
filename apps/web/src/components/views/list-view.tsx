import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUiStore } from '@/stores/ui-store'
import type { BoardWithColumns, TaskWithRelations } from '@taskflow/shared'
import { format, isPast, isToday } from 'date-fns'

const priorityConfig: Record<string, { label: string; color: string; order: number }> = {
  critical: { label: 'Critical', color: 'bg-red-500 text-red-50', order: 0 },
  high: { label: 'High', color: 'bg-orange-500 text-orange-50', order: 1 },
  medium: { label: 'Medium', color: 'bg-yellow-500 text-yellow-50', order: 2 },
  low: { label: 'Low', color: 'bg-blue-500 text-blue-50', order: 3 },
}

type SortKey = 'identifier' | 'title' | 'priority' | 'status' | 'dueDate' | 'estimatePoints'
type SortDir = 'asc' | 'desc'

interface TaskRow extends TaskWithRelations {
  columnName: string
  columnColor: string | null
}

interface ListViewProps {
  board: BoardWithColumns
}

export function ListView({ board }: ListViewProps) {
  const { openTask } = useUiStore()
  const [sortKey, setSortKey] = useState<SortKey>('identifier')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const tasks = useMemo(() => {
    const rows: TaskRow[] = []
    for (const col of board.columns) {
      for (const task of col.tasks) {
        rows.push({ ...task, columnName: col.name, columnColor: col.color })
      }
    }
    return rows
  }, [board])

  const sorted = useMemo(() => {
    const copy = [...tasks]
    copy.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'identifier':
          cmp = a.identifier.localeCompare(b.identifier, undefined, { numeric: true })
          break
        case 'title':
          cmp = a.title.localeCompare(b.title)
          break
        case 'priority':
          cmp = (priorityConfig[a.priority]?.order ?? 9) - (priorityConfig[b.priority]?.order ?? 9)
          break
        case 'status':
          cmp = a.columnName.localeCompare(b.columnName)
          break
        case 'dueDate':
          cmp = (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999')
          break
        case 'estimatePoints':
          cmp = (a.estimatePoints ?? 0) - (b.estimatePoints ?? 0)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [tasks, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="ml-1 inline h-3 w-3 text-muted-foreground/50" />
    return sortDir === 'asc' ? (
      <ArrowUp className="ml-1 inline h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 inline h-3 w-3" />
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24 cursor-pointer select-none" onClick={() => handleSort('identifier')}>
              ID <SortIcon column="identifier" />
            </TableHead>
            <TableHead className="cursor-pointer select-none" onClick={() => handleSort('title')}>
              Title <SortIcon column="title" />
            </TableHead>
            <TableHead className="w-28 cursor-pointer select-none" onClick={() => handleSort('priority')}>
              Priority <SortIcon column="priority" />
            </TableHead>
            <TableHead className="w-40">Labels</TableHead>
            <TableHead className="w-32 cursor-pointer select-none" onClick={() => handleSort('status')}>
              Status <SortIcon column="status" />
            </TableHead>
            <TableHead className="w-28 cursor-pointer select-none" onClick={() => handleSort('dueDate')}>
              Due Date <SortIcon column="dueDate" />
            </TableHead>
            <TableHead className="w-20 cursor-pointer select-none text-right" onClick={() => handleSort('estimatePoints')}>
              Est. <SortIcon column="estimatePoints" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((task) => {
            const isOverdue = task.dueDate && !task.completedAt && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
            return (
              <TableRow
                key={task.id}
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => openTask(task.id)}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">{task.identifier}</TableCell>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn('text-[10px]', priorityConfig[task.priority]?.color)}>
                    {priorityConfig[task.priority]?.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {task.labels.map((label) => (
                      <div
                        key={label.id}
                        className="h-2.5 w-2.5 rounded-full"
                        title={label.name}
                        style={{ backgroundColor: label.color }}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {task.columnColor && (
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: task.columnColor }} />
                    )}
                    <span className="text-sm">{task.columnName}</span>
                  </div>
                </TableCell>
                <TableCell className={cn('text-sm', isOverdue && 'text-red-500 font-medium')}>
                  {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '—'}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {task.estimatePoints ?? '—'}
                </TableCell>
              </TableRow>
            )
          })}
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                No tasks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
