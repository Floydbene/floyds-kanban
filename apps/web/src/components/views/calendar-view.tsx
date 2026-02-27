import { useMemo, useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/stores/ui-store'
import type { BoardWithColumns, TaskWithRelations } from '@taskflow/shared'

const priorityColors: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarViewProps {
  board: BoardWithColumns
}

export function CalendarView({ board }: CalendarViewProps) {
  const { openTask } = useUiStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const tasks = useMemo(() => {
    const all: TaskWithRelations[] = []
    for (const col of board.columns) {
      for (const task of col.tasks) {
        if (task.dueDate) all.push(task)
      }
    }
    return all
  }, [board])

  const tasksByDate = useMemo(() => {
    const map = new Map<string, TaskWithRelations[]>()
    for (const task of tasks) {
      if (!task.dueDate) continue
      const key = format(new Date(task.dueDate), 'yyyy-MM-dd')
      const arr = map.get(key) ?? []
      arr.push(task)
      map.set(key, arr)
    }
    return map
  }, [tasks])

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calStart = startOfWeek(monthStart)
    const calEnd = endOfWeek(monthEnd)
    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [currentMonth])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setCurrentMonth(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px rounded-lg border bg-border overflow-hidden">
        {weekdays.map((day) => (
          <div key={day} className="bg-muted px-2 py-1.5 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {calendarDays.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const dayTasks = tasksByDate.get(key) ?? []
          const inMonth = isSameMonth(day, currentMonth)

          return (
            <div
              key={key}
              className={cn(
                'min-h-24 bg-background p-1.5',
                !inMonth && 'bg-muted/30',
              )}
            >
              <div
                className={cn(
                  'mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs',
                  isToday(day) && 'bg-primary text-primary-foreground font-bold',
                  !inMonth && 'text-muted-foreground/50',
                )}
              >
                {format(day, 'd')}
              </div>
              <div className="flex flex-col gap-0.5">
                {dayTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => openTask(task.id)}
                    className={cn(
                      'w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium text-white',
                      priorityColors[task.priority] ?? 'bg-muted',
                    )}
                    title={task.title}
                  >
                    {task.title}
                  </button>
                ))}
                {dayTasks.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">+{dayTasks.length - 3} more</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
