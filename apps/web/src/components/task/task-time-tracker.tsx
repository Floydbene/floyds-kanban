import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Square, Clock } from 'lucide-react'
import { useTimerStore } from '@/stores/timer-store'
import type { TimeEntry } from '@taskflow/shared'

interface TaskTimeTrackerProps {
  taskId: string
  timeEntries: TimeEntry[]
  onStart: () => void
  onStop: () => void
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function formatDurationShort(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function TaskTimeTracker({ taskId, timeEntries, onStart, onStop }: TaskTimeTrackerProps) {
  const { activeTaskId, isRunning, elapsed, tick } = useTimerStore()
  const isTrackingThis = isRunning && activeTaskId === taskId

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [isRunning, tick])

  const totalSeconds = timeEntries.reduce((sum, e) => sum + (e.durationSeconds ?? 0), 0)

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">Time tracking</span>

      <div className="flex items-center gap-2">
        {isTrackingThis ? (
          <Button variant="destructive" size="sm" className="h-8 gap-1.5 text-xs" onClick={onStop}>
            <Square className="h-3 w-3" />
            Stop
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={onStart}
            disabled={isRunning && activeTaskId !== taskId}
          >
            <Play className="h-3 w-3" />
            Start
          </Button>
        )}

        {isTrackingThis && (
          <span className="font-mono text-sm tabular-nums text-primary">
            {formatDuration(elapsed)}
          </span>
        )}
      </div>

      {totalSeconds > 0 && (
        <p className="text-xs text-muted-foreground">
          Total: {formatDurationShort(totalSeconds)}
        </p>
      )}

      {timeEntries.length > 0 && (
        <div className="mt-2 space-y-1">
          {timeEntries.slice(0, 5).map((entry) => (
            <div key={entry.id} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDurationShort(entry.durationSeconds ?? 0)}</span>
              <span className="text-muted-foreground/60">
                {new Date(entry.startedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
