import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TaskPriority } from '@taskflow/shared'

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  critical: { label: 'Critical', color: 'bg-red-500' },
  high: { label: 'High', color: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'bg-yellow-500' },
  low: { label: 'Low', color: 'bg-blue-500' },
}

interface TaskPriorityProps {
  priority: TaskPriority
  onChange: (priority: TaskPriority) => void
}

export function TaskPrioritySelect({ priority, onChange }: TaskPriorityProps) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">Priority</span>
      <Select value={priority} onValueChange={(v) => onChange(v as TaskPriority)}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.entries(PRIORITY_CONFIG) as [TaskPriority, { label: string; color: string }][]).map(
            ([value, config]) => (
              <SelectItem key={value} value={value}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${config.color}`} />
                  {config.label}
                </div>
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
