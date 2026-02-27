import { useState, type KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ExternalLink, Github, Link, Plus, X } from 'lucide-react'
import type { TaskResource } from '@taskflow/shared'

function detectResourceType(url: string): string {
  try {
    const hostname = new URL(url).hostname
    if (hostname.includes('github.com')) return 'github'
    return 'link'
  } catch {
    return 'link'
  }
}

function getResourceIcon(resourceType: string) {
  switch (resourceType) {
    case 'github':
      return <Github className="h-3.5 w-3.5 shrink-0" />
    default:
      return <Link className="h-3.5 w-3.5 shrink-0" />
  }
}

function getTitleFromUrl(url: string): string {
  try {
    const parsed = new URL(url)
    const path = parsed.pathname.replace(/^\//, '').replace(/\/$/, '')
    if (path) return path
    return parsed.hostname
  } catch {
    return url
  }
}

interface TaskResourcesProps {
  resources: TaskResource[]
  onCreate: (title: string, url: string, resourceType: string) => void
  onDelete: (resourceId: string) => void
}

export function TaskResources({ resources, onCreate, onDelete }: TaskResourcesProps) {
  const [urlInput, setUrlInput] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  function handleAdd() {
    const trimmed = urlInput.trim()
    if (!trimmed) return

    try {
      new URL(trimmed)
    } catch {
      return
    }

    const resourceType = detectResourceType(trimmed)
    const title = getTitleFromUrl(trimmed)
    onCreate(title, trimmed, resourceType)
    setUrlInput('')
    setIsAdding(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    } else if (e.key === 'Escape') {
      setIsAdding(false)
      setUrlInput('')
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-muted-foreground">
        Resources{resources.length > 0 && ` (${resources.length})`}
      </span>

      {resources.length > 0 && (
        <div className="space-y-1">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="group flex items-center gap-2 rounded-md px-1 py-1 transition-colors hover:bg-accent/50"
            >
              {getResourceIcon(resource.resourceType)}
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 flex-1 items-center gap-1 text-sm text-primary hover:underline"
              >
                <span className="truncate">{resource.title}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(resource.id)}
                className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="flex items-center gap-2">
          <Link className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <Input
            autoFocus
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!urlInput.trim()) {
                setIsAdding(false)
              }
            }}
            placeholder="Paste a URL..."
            className="h-7 flex-1 border-none bg-transparent px-1 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
          />
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add resource</span>
        </button>
      )}
    </div>
  )
}
