import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Pencil, Trash2, Hash, CheckCircle2, ChevronsLeftRight, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Column } from '@taskflow/shared'

interface ColumnHeaderProps {
  column: Column
  taskCount: number
  onRename: (name: string) => void
  onSetWipLimit: (limit: number | null) => void
  onToggleDoneColumn: () => void
  onToggleBlockedColumn: () => void
  onToggleCollapse: () => void
  onDelete: () => void
}

export function ColumnHeader({
  column,
  taskCount,
  onRename,
  onSetWipLimit,
  onToggleDoneColumn,
  onToggleBlockedColumn,
  onToggleCollapse,
  onDelete,
}: ColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(column.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  function handleSubmitRename() {
    const trimmed = editName.trim()
    if (trimmed && trimmed !== column.name) {
      onRename(trimmed)
    } else {
      setEditName(column.name)
    }
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmitRename()
    }
    if (e.key === 'Escape') {
      setEditName(column.name)
      setIsEditing(false)
    }
  }

  const isOverWipLimit = column.wipLimit !== null && taskCount > column.wipLimit

  return (
    <div className="mb-2 flex items-center gap-2 px-1">
      {column.color && (
        <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: column.color }} />
      )}

      {column.isBlockedColumn && !column.color && (
        <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
      )}

      {isEditing ? (
        <Input
          ref={inputRef}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleSubmitRename}
          onKeyDown={handleKeyDown}
          className="h-6 px-1 text-sm font-medium"
        />
      ) : (
        <h3
          className={`cursor-default truncate text-sm font-medium ${column.isBlockedColumn ? 'text-red-400' : ''}`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {column.name}
        </h3>
      )}

      <span
        className={`shrink-0 rounded-full px-1.5 py-0.5 text-xs font-medium ${
          isOverWipLimit
            ? 'bg-destructive/20 text-destructive'
            : 'text-muted-foreground'
        }`}
      >
        {taskCount}
        {column.wipLimit !== null && `/${column.wipLimit}`}
      </span>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const input = prompt('WIP limit (empty to remove):', column.wipLimit?.toString() ?? '')
                if (input === null) return
                const limit = input.trim() === '' ? null : parseInt(input, 10)
                if (limit !== null && isNaN(limit)) return
                onSetWipLimit(limit)
              }}
            >
              <Hash className="mr-2 h-4 w-4" />
              Set WIP Limit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleDoneColumn}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {column.isDoneColumn ? 'Unmark as Done' : 'Mark as Done'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleBlockedColumn}>
              <ShieldAlert className="mr-2 h-4 w-4" />
              {column.isBlockedColumn ? 'Unmark as Blocked' : 'Mark as Blocked'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleCollapse}>
              <ChevronsLeftRight className="mr-2 h-4 w-4" />
              {column.isCollapsed ? 'Expand' : 'Collapse'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                if (confirm(`Delete column "${column.name}"? Tasks will be removed.`)) {
                  onDelete()
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
