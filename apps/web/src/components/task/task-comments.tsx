import { useState, type KeyboardEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Comment } from '@taskflow/shared'

interface TaskCommentsProps {
  comments: Comment[]
  currentUserId: string | null
  onCreate: (content: string) => void
  onUpdate: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
}

export function TaskComments({ comments, currentUserId, onCreate, onUpdate, onDelete }: TaskCommentsProps) {
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  function handleSubmit() {
    const trimmed = newComment.trim()
    if (trimmed) {
      onCreate(trimmed)
      setNewComment('')
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function startEdit(comment: Comment) {
    setEditingId(comment.id)
    setEditValue(comment.content)
  }

  function saveEdit(commentId: string) {
    const trimmed = editValue.trim()
    if (trimmed) {
      onUpdate(commentId, trimmed)
    }
    setEditingId(null)
  }

  function handleEditKeyDown(e: KeyboardEvent<HTMLTextAreaElement>, commentId: string) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      saveEdit(commentId)
    } else if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  function getInitials(name?: string) {
    if (!name) return '?'
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const sorted = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="space-y-4">
      <span className="text-sm font-medium text-muted-foreground">
        Comments{comments.length > 0 && ` (${comments.length})`}
      </span>

      <div className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          className="min-h-[80px] resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter to submit
          </span>
          <Button size="sm" onClick={handleSubmit} disabled={!newComment.trim()}>
            Comment
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map((comment) => (
          <div key={comment.id} className="group flex gap-3">
            <Avatar className="h-7 w-7">
              <AvatarImage src={comment.author?.avatarUrl ?? undefined} />
              <AvatarFallback className="text-[10px]">
                {getInitials(comment.author?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{comment.author?.name ?? 'Unknown'}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                {currentUserId === comment.authorId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => startEdit(comment)}>
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(comment.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {editingId === comment.id ? (
                <div className="space-y-2">
                  <Textarea
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, comment.id)}
                    className="min-h-[60px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 text-xs" onClick={() => saveEdit(comment.id)}>
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm prose-invert max-w-none text-sm text-foreground/90 [&_a]:text-primary [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_p]:my-1">
                  <ReactMarkdown>{comment.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
