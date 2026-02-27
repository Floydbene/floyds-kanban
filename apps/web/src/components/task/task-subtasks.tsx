import { useState, useRef, type KeyboardEvent } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import type { Subtask } from '@taskflow/shared'

interface TaskSubtasksProps {
  subtasks: Subtask[]
  onToggle: (subtaskId: string, isCompleted: boolean) => void
  onUpdateTitle: (subtaskId: string, title: string) => void
  onCreate: (title: string) => void
  onDelete: (subtaskId: string) => void
}

export function TaskSubtasks({ subtasks, onToggle, onUpdateTitle, onCreate, onDelete }: TaskSubtasksProps) {
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const completed = subtasks.filter((s) => s.isCompleted).length
  const total = subtasks.length
  const progress = total > 0 ? (completed / total) * 100 : 0

  function handleCreate() {
    const trimmed = newTitle.trim()
    if (trimmed) {
      onCreate(trimmed)
      setNewTitle('')
      inputRef.current?.focus()
    }
  }

  function handleCreateKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') handleCreate()
  }

  function startEditing(subtask: Subtask) {
    setEditingId(subtask.id)
    setEditValue(subtask.title)
  }

  function saveEdit(subtaskId: string) {
    const trimmed = editValue.trim()
    if (trimmed) {
      onUpdateTitle(subtaskId, trimmed)
    }
    setEditingId(null)
  }

  function handleEditKeyDown(e: KeyboardEvent, subtaskId: string) {
    if (e.key === 'Enter') saveEdit(subtaskId)
    else if (e.key === 'Escape') setEditingId(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Subtasks{total > 0 && ` (${completed}/${total})`}
        </span>
      </div>

      {total > 0 && <Progress value={progress} className="h-1.5" />}

      <div className="space-y-1">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="group flex items-center gap-2 rounded-md px-1 py-1 transition-colors hover:bg-accent/50"
          >
            <Checkbox
              checked={subtask.isCompleted}
              onCheckedChange={() => onToggle(subtask.id, !subtask.isCompleted)}
              className="h-3.5 w-3.5"
            />
            {editingId === subtask.id ? (
              <Input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(subtask.id)}
                onKeyDown={(e) => handleEditKeyDown(e, subtask.id)}
                className="h-6 flex-1 border-none bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
              />
            ) : (
              <span
                onClick={() => startEditing(subtask)}
                className={`flex-1 cursor-pointer text-sm ${
                  subtask.isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
                }`}
              >
                {subtask.title}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(subtask.id)}
              className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleCreateKeyDown}
          placeholder="Add subtask..."
          className="h-7 flex-1 border-none bg-transparent px-1 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
        />
      </div>
    </div>
  )
}
