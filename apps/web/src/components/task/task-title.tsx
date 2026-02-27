import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'

interface TaskTitleProps {
  title: string
  onSave: (title: string) => void
}

export function TaskTitle({ title, onSave }: TaskTitleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(title)
  }, [title])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  function handleSave() {
    const trimmed = value.trim()
    if (trimmed && trimmed !== title) {
      onSave(trimmed)
    } else {
      setValue(title)
    }
    setIsEditing(false)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setValue(title)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-auto border-none bg-transparent px-0 text-xl font-bold shadow-none focus-visible:ring-0"
      />
    )
  }

  return (
    <h2
      onClick={() => setIsEditing(true)}
      className="cursor-pointer rounded px-0 text-xl font-bold text-foreground transition-colors hover:text-foreground/80"
    >
      {title}
    </h2>
  )
}
