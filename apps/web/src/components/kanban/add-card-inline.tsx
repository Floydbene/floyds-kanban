import { useState, useRef, useEffect } from 'react'
import { Plus, CheckCircle2, Bug, Zap, GitBranch } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { TaskType } from '@taskflow/shared'

const TYPES: { value: TaskType; label: string; icon: typeof CheckCircle2; color: string }[] = [
  { value: 'task', label: 'Task', icon: CheckCircle2, color: 'text-blue-500' },
  { value: 'bug', label: 'Bug', icon: Bug, color: 'text-red-500' },
  { value: 'spike', label: 'Spike', icon: Zap, color: 'text-amber-500' },
  { value: 'subtask', label: 'Subtask', icon: GitBranch, color: 'text-slate-400' },
]

interface AddCardInlineProps {
  onAdd: (title: string, type: TaskType) => void
}

export function AddCardInline({ onAdd }: AddCardInlineProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<TaskType>('task')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  function handleSubmit() {
    const trimmed = title.trim()
    if (trimmed) {
      onAdd(trimmed, type)
      setTitle('')
      setType('task')
    }
    setIsOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      setTitle('')
      setType('task')
      setIsOpen(false)
    }
  }

  if (isOpen) {
    return (
      <div className="space-y-1.5 px-0.5">
        <div className="flex gap-1">
          {TYPES.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.value}
                type="button"
                title={t.label}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setType(t.value)}
                className={cn(
                  'flex items-center gap-1 rounded-md border px-1.5 py-1 text-xs transition-colors',
                  type === t.value
                    ? 'border-border bg-accent text-foreground'
                    : 'border-transparent text-muted-foreground hover:bg-accent/50',
                )}
              >
                <Icon className={cn('h-3 w-3', t.color)} />
                {t.label}
              </button>
            )
          })}
        </div>
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          placeholder="Task title..."
          className="h-8 bg-card text-sm"
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
    >
      <Plus className="h-4 w-4" />
      Add card
    </button>
  )
}
