import { useNavigate, useParams } from 'react-router'
import { Columns3, List, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/stores/ui-store'

const views = [
  { key: 'board' as const, icon: Columns3, label: 'Board', path: 'board' },
  { key: 'list' as const, icon: List, label: 'List', path: 'list' },
  { key: 'calendar' as const, icon: CalendarDays, label: 'Calendar', path: 'calendar' },
]

export function ViewSwitcher() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { activeView, setActiveView } = useUiStore()

  const handleViewChange = (view: typeof views[number]) => {
    setActiveView(view.key)
    if (slug) {
      navigate(`/projects/${slug}/${view.path}`)
    }
  }

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {views.map((view) => (
        <Button
          key={view.key}
          variant={activeView === view.key ? 'secondary' : 'ghost'}
          size="sm"
          className={cn(
            'h-7 gap-1.5 px-2.5 text-xs',
            activeView === view.key
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
          onClick={() => handleViewChange(view)}
        >
          <view.icon className="h-3.5 w-3.5" />
          {view.label}
        </Button>
      ))}
    </div>
  )
}
