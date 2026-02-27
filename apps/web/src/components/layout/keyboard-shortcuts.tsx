import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useUiStore } from '@/stores/ui-store'

const shortcutGroups = [
  {
    title: 'General',
    shortcuts: [
      { keys: ['⌘', 'K'], description: 'Open command palette' },
      { keys: ['C'], description: 'Create new task' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close panel / dialog' },
    ],
  },
  {
    title: 'Go to (press G then…)',
    shortcuts: [
      { keys: ['G', 'D'], description: 'Dashboard' },
      { keys: ['G', 'A'], description: 'All Tasks' },
      { keys: ['G', 'P'], description: 'Projects' },
      { keys: ['G', 'S'], description: 'Settings' },
      { keys: ['G', 'F'], description: "Floyd's Prod" },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['J'], description: 'Next task' },
      { keys: ['K'], description: 'Previous task' },
      { keys: ['Enter'], description: 'Open selected task' },
    ],
  },
  {
    title: 'Task (when panel open)',
    shortcuts: [
      { keys: ['1'], description: 'Set priority: Low' },
      { keys: ['2'], description: 'Set priority: Medium' },
      { keys: ['3'], description: 'Set priority: High' },
      { keys: ['4'], description: 'Set priority: Critical' },
    ],
  },
]

const GO_TO_ROUTES: Record<string, string> = {
  d: '/dashboard',
  a: '/all-tasks',
  p: '/projects',
  s: '/settings',
  f: '/cheatsheet',
}

export function KeyboardShortcuts() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const { setCommandPaletteOpen, taskPanelOpen } = useUiStore()
  const navigate = useNavigate()
  const pendingG = useRef(false)
  const gTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when user is typing in an input/textarea
      const target = e.target as HTMLElement
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('[role="combobox"]')

      if (isInput) return

      // Handle second key of G chord
      if (pendingG.current) {
        pendingG.current = false
        clearTimeout(gTimer.current)
        const route = GO_TO_ROUTES[e.key.toLowerCase()]
        if (route) {
          e.preventDefault()
          navigate(route)
        }
        return
      }

      // G = Start "go to" chord (wait for second key)
      if (e.key === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        pendingG.current = true
        gTimer.current = setTimeout(() => {
          pendingG.current = false
        }, 500)
        return
      }

      // ? = Show shortcuts dialog
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setShortcutsOpen(true)
        return
      }

      // c = Create new task
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey && !taskPanelOpen) {
        e.preventDefault()
        const addCardBtn = document.querySelector<HTMLButtonElement>(
          '[data-add-card-trigger]',
        )
        if (addCardBtn) addCardBtn.click()
        return
      }

      // Escape = Close panel/dialog
      // (handled by radix dialogs natively, but we can close task panel too)

      // 1-4 = Set priority when task panel is open
      if (taskPanelOpen && ['1', '2', '3', '4'].includes(e.key) && !e.metaKey && !e.ctrlKey) {
        const priorityMap: Record<string, string> = {
          '1': 'low',
          '2': 'medium',
          '3': 'high',
          '4': 'critical',
        }
        const priority = priorityMap[e.key]
        if (priority) {
          const priorityBtn = document.querySelector<HTMLButtonElement>(
            `[data-priority="${priority}"]`,
          )
          if (priorityBtn) {
            e.preventDefault()
            priorityBtn.click()
          }
        }
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(gTimer.current)
    }
  }, [setCommandPaletteOpen, taskPanelOpen, navigate])

  return (
    <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Navigate Taskflow faster with keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h4>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-foreground">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key) => (
                        <kbd
                          key={key}
                          className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
