import { useEffect, useRef, useState } from 'react'
import { Search, X, ChevronDown, Check, CheckCircle2, Bug, Zap, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useFilterStore } from '@/stores/filter-store'
import { useLabels } from '@/hooks/queries/use-labels'
import type { TaskPriority, TaskType } from '@taskflow/shared'

const priorities: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'critical', label: 'Critical', color: 'bg-red-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
]

const taskTypes: { value: TaskType; label: string; icon: typeof CheckCircle2; color: string }[] = [
  { value: 'task', label: 'Task', icon: CheckCircle2, color: 'text-blue-500' },
  { value: 'bug', label: 'Bug', icon: Bug, color: 'text-red-500' },
  { value: 'spike', label: 'Spike', icon: Zap, color: 'text-amber-500' },
  { value: 'subtask', label: 'Subtask', icon: GitBranch, color: 'text-slate-400' },
]

const dueDateOptions: { value: string; label: string }[] = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due Today' },
  { value: 'this-week', label: 'Due This Week' },
  { value: 'this-month', label: 'Due This Month' },
  { value: 'no-date', label: 'No Due Date' },
]

interface FilterBarProps {
  projectSlug: string
}

export function FilterBar({ projectSlug }: FilterBarProps) {
  const {
    search,
    priorities: selectedPriorities,
    types: selectedTypes,
    labels: selectedLabels,
    dueDateFilter,
    setSearch,
    togglePriority,
    toggleType,
    toggleLabel,
    setDueDateFilter,
    clearFilters,
  } = useFilterStore()

  const { data: labels } = useLabels(projectSlug)
  const [localSearch, setLocalSearch] = useState(search)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(localSearch)
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [localSearch, setSearch])

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  const activeFilterCount =
    selectedPriorities.length + selectedTypes.length + selectedLabels.length + (dueDateFilter ? 1 : 0) + (search ? 1 : 0)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="h-8 w-56 pl-8 text-sm"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            Priority
            {selectedPriorities.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1 text-[10px]">
                {selectedPriorities.length}
              </Badge>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {priorities.map((p) => (
            <DropdownMenuItem
              key={p.value}
              onClick={(e) => {
                e.preventDefault()
                togglePriority(p.value)
              }}
              className="gap-2"
            >
              <Checkbox checked={selectedPriorities.includes(p.value)} className="h-3.5 w-3.5" />
              <div className={cn('h-2 w-2 rounded-full', p.color)} />
              {p.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            Type
            {selectedTypes.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1 text-[10px]">
                {selectedTypes.length}
              </Badge>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {taskTypes.map((t) => {
            const Icon = t.icon
            return (
              <DropdownMenuItem
                key={t.value}
                onClick={(e) => {
                  e.preventDefault()
                  toggleType(t.value)
                }}
                className="gap-2"
              >
                <Checkbox checked={selectedTypes.includes(t.value)} className="h-3.5 w-3.5" />
                <Icon className={cn('h-3.5 w-3.5', t.color)} />
                {t.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            Labels
            {selectedLabels.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1 text-[10px]">
                {selectedLabels.length}
              </Badge>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          {labels?.map((label) => (
            <DropdownMenuItem
              key={label.id}
              onClick={(e) => {
                e.preventDefault()
                toggleLabel(label.id)
              }}
              className="gap-2"
            >
              <Checkbox checked={selectedLabels.includes(label.id)} className="h-3.5 w-3.5" />
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: label.color }} />
              <span className="truncate">{label.name}</span>
            </DropdownMenuItem>
          ))}
          {(!labels || labels.length === 0) && (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">No labels</div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            Due Date
            {dueDateFilter && (
              <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1 text-[10px]">
                1
              </Badge>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {dueDateOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() =>
                setDueDateFilter(dueDateFilter === opt.value ? null : (opt.value as typeof dueDateFilter))
              }
              className="gap-2"
            >
              {dueDateFilter === opt.value && <Check className="h-3.5 w-3.5" />}
              <span className={cn(dueDateFilter !== opt.value && 'ml-5')}>{opt.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-xs text-muted-foreground" onClick={clearFilters}>
          <X className="h-3 w-3" />
          Clear
          <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px]">
            {activeFilterCount}
          </Badge>
        </Button>
      )}
    </div>
  )
}
