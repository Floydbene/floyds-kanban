import { CheckCircle2, Ban, Copy, SearchX, Archive, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TaskResolution } from '@taskflow/shared'

const RESOLUTION_CONFIG: Record<TaskResolution, { label: string; icon: typeof CheckCircle2; color: string }> = {
  done: { label: 'Done', icon: CheckCircle2, color: 'text-green-500' },
  wont_do: { label: "Won't Do", icon: Ban, color: 'text-slate-400' },
  duplicate: { label: 'Duplicate', icon: Copy, color: 'text-orange-500' },
  cannot_reproduce: { label: 'Cannot Reproduce', icon: SearchX, color: 'text-purple-500' },
  obsolete: { label: 'Obsolete', icon: Archive, color: 'text-slate-400' },
}

interface TaskResolutionSelectProps {
  resolution: TaskResolution | null
  onChange: (resolution: TaskResolution | null) => void
}

export function TaskResolutionSelect({ resolution, onChange }: TaskResolutionSelectProps) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">Resolution</span>
      <Select
        value={resolution ?? '_none'}
        onValueChange={(v) => onChange(v === '_none' ? null : (v as TaskResolution))}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_none">
            <div className="flex items-center gap-2">
              <X className="h-3.5 w-3.5 text-muted-foreground" />
              No resolution
            </div>
          </SelectItem>
          {(Object.entries(RESOLUTION_CONFIG) as [TaskResolution, (typeof RESOLUTION_CONFIG)[TaskResolution]][]).map(
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
