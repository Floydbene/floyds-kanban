import { useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface TaskBlockedProps {
  isBlocked: boolean
  blockedReason: string | null
  onChange: (isBlocked: boolean, blockedReason: string | null) => void
}

export function TaskBlocked({ isBlocked, blockedReason, onChange }: TaskBlockedProps) {
  const [reason, setReason] = useState(blockedReason ?? '')
  const [editing, setEditing] = useState(false)

  const handleBlock = () => {
    setEditing(true)
  }

  const handleSubmit = () => {
    if (!reason.trim()) return
    onChange(true, reason.trim())
    setEditing(false)
  }

  const handleUnblock = () => {
    onChange(false, null)
    setReason('')
    setEditing(false)
  }

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">Blocked</span>

      {isBlocked ? (
        <div className="space-y-2">
          <div className="rounded-md border border-red-500/50 bg-red-500/10 p-2">
            <div className="mb-1 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
              <span className="text-xs font-medium text-red-400">Blocked</span>
            </div>
            {editing ? (
              <div className="space-y-1.5">
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why is this blocked?"
                  className="min-h-[60px] border-red-500/30 bg-transparent text-xs"
                  autoFocus
                />
                <div className="flex gap-1">
                  <Button size="sm" className="h-6 text-xs" onClick={handleSubmit}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs"
                    onClick={() => {
                      setEditing(false)
                      setReason(blockedReason ?? '')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p
                className="cursor-pointer text-xs text-red-300/80"
                onClick={() => setEditing(true)}
              >
                {blockedReason}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-full text-xs"
            onClick={handleUnblock}
          >
            Unblock
          </Button>
        </div>
      ) : editing ? (
        <div className="space-y-1.5">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why is this blocked?"
            className="min-h-[60px] text-xs"
            autoFocus
          />
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="destructive"
              className="h-6 text-xs"
              onClick={handleSubmit}
              disabled={!reason.trim()}
            >
              Mark blocked
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 text-xs"
              onClick={() => {
                setEditing(false)
                setReason('')
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className={cn('h-8 w-full justify-start gap-2 text-xs font-normal text-muted-foreground')}
          onClick={handleBlock}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          Mark as blocked
        </Button>
      )}
    </div>
  )
}
