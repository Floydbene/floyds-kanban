import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, Plus } from 'lucide-react'
import type { Label } from '@taskflow/shared'

interface TaskLabelsProps {
  taskLabels: Label[]
  allLabels: Label[]
  onToggle: (labelId: string, isActive: boolean) => void
}

export function TaskLabels({ taskLabels, allLabels, onToggle }: TaskLabelsProps) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const activeLabelIds = new Set(taskLabels.map((l) => l.id))

  const filtered = allLabels.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">Labels</span>
      <div className="flex flex-wrap gap-1">
        {taskLabels.map((label) => (
          <Badge
            key={label.id}
            className="text-xs"
            style={{
              backgroundColor: `${label.color}20`,
              color: label.color,
              borderColor: `${label.color}40`,
            }}
          >
            {label.name}
          </Badge>
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <Input
              placeholder="Filter labels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2 h-8 text-xs"
            />
            <div className="max-h-48 space-y-0.5 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="py-2 text-center text-xs text-muted-foreground">No labels found</p>
              ) : (
                filtered.map((label) => {
                  const isActive = activeLabelIds.has(label.id)
                  return (
                    <button
                      key={label.id}
                      onClick={() => onToggle(label.id, isActive)}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs transition-colors hover:bg-accent"
                    >
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: label.color }}
                      />
                      <span className="flex-1 text-left">{label.name}</span>
                      {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
                    </button>
                  )
                })
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
