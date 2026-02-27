import { CheckCircle2, Bug, Zap, GitBranch } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TaskType } from '@taskflow/shared'

const TYPE_CONFIG: Record<TaskType, { label: string; icon: typeof CheckCircle2; color: string }> = {
  task: { label: 'Task', icon: CheckCircle2, color: 'text-blue-500' },
  bug: { label: 'Bug', icon: Bug, color: 'text-red-500' },
  spike: { label: 'Spike', icon: Zap, color: 'text-amber-500' },
  subtask: { label: 'Subtask', icon: GitBranch, color: 'text-slate-400' },
}

interface TaskTypeSelectProps {
  type: TaskType
  onChange: (type: TaskType) => void
}

export function TaskTypeSelect({ type, onChange }: TaskTypeSelectProps) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">Type</span>
      <Select value={type} onValueChange={(v) => onChange(v as TaskType)}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.entries(TYPE_CONFIG) as [TaskType, (typeof TYPE_CONFIG)[TaskType]][]).map(
            ([value, config]) => {
              const Icon = config.icon
              return (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                    {config.label}
                  </div>
                </SelectItem>
              )
            },
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
