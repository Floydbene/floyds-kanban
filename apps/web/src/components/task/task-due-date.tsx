import { format, isPast, isToday } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatTimeRemaining(date: Date): string {
  const diff = date.getTime() - Date.now()
  const absDiff = Math.abs(diff)
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))

  const prefix = diff < 0 ? 'Overdue by ' : ''
  const suffix = diff >= 0 ? ' left' : ''

  if (days > 0) return `${prefix}${days}d ${hours}h${suffix}`
  if (hours > 0) return `${prefix}${hours}h ${minutes}m${suffix}`
  return `${prefix}${minutes}m${suffix}`
}

interface TaskDueDateProps {
  dueDate: string | null
  onChange: (date: string | null) => void
}

export function TaskDueDate({ dueDate, onChange }: TaskDueDateProps) {
  const date = dueDate ? new Date(dueDate) : undefined
  const isOverdue = date && isPast(date) && !isToday(date)

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">Due date</span>
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-8 flex-1 justify-start gap-2 text-xs font-normal',
                !date && 'text-muted-foreground',
                isOverdue && 'border-red-500/50 text-red-400',
              )}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              {date ? (
                <>
                  {format(date, 'MMM d, yyyy')}
                  <span className={cn('ml-auto text-[10px] font-medium', isOverdue ? 'text-red-400' : 'text-muted-foreground')}>
                    {formatTimeRemaining(date)}
                  </span>
                </>
              ) : (
                'No due date'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(day) => {
                if (!day) return onChange(null)
                const eod = new Date(day)
                eod.setHours(23, 59, 59, 999)
                onChange(eod.toISOString())
              }}
            />
          </PopoverContent>
        </Popover>
        {date && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
            className="h-8 w-8 p-0"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
