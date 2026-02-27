import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Eye } from 'lucide-react'

interface TaskDescriptionProps {
  description: string | null
  onSave: (description: string) => void
}

export function TaskDescription({ description, onSave }: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(description ?? '')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setValue(description ?? '')
  }, [description])

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus()
    }
  }, [isEditing])

  function handleSave() {
    if (value !== (description ?? '')) {
      onSave(value)
    }
    setIsEditing(false)
  }

  if (!isEditing && !description) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="w-full rounded-md border border-dashed border-border p-4 text-left text-sm text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-muted-foreground/80"
      >
        Add a description...
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Description</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (isEditing) handleSave()
            else setIsEditing(true)
          }}
          className="h-7 gap-1.5 text-xs"
        >
          {isEditing ? (
            <>
              <Eye className="h-3.5 w-3.5" />
              Preview
            </>
          ) : (
            <>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          placeholder="Write a description using markdown..."
          className="min-h-[120px] resize-y"
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="prose prose-sm prose-invert max-w-none cursor-pointer rounded-md text-foreground [&_a]:text-primary [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_pre]:bg-muted [&_pre]:p-3"
        >
          <ReactMarkdown>{description!}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
