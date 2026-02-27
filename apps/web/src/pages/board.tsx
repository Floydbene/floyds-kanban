import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router'
import { motion } from 'framer-motion'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { FilterBar } from '@/components/filters/filter-bar'
import { FilterPresetMenu } from '@/components/filters/filter-preset-menu'
import { ViewSwitcher } from '@/components/views/view-switcher'
import { ListView } from '@/components/views/list-view'
import { CalendarView } from '@/components/views/calendar-view'
import { Skeleton } from '@/components/ui/skeleton'
import { useBoard } from '@/hooks/queries/use-board'
import { useUiStore } from '@/stores/ui-store'

type ActiveView = 'board' | 'list' | 'calendar'

export function BoardPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const activeView = useUiStore((s) => s.activeView)
  const setActiveView = useUiStore((s) => s.setActiveView)
  const { data: board, isLoading } = useBoard(slug ?? '')

  // Sync activeView with the URL path on mount or path change
  useEffect(() => {
    const pathEnd = location.pathname.split('/').pop() as ActiveView
    if (['board', 'list', 'calendar'].includes(pathEnd) && pathEnd !== activeView) {
      setActiveView(pathEnd)
    }
  }, [location.pathname, setActiveView]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!slug) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No project selected</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 px-6 py-3">
        <FilterBar projectSlug={slug} />
        <FilterPresetMenu />
        <div className="flex-1" />
        <ViewSwitcher />
      </div>

      <motion.div
        key={activeView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex-1 overflow-hidden"
      >
        {activeView === 'board' && <KanbanBoard projectSlug={slug} />}
        {activeView === 'list' && (
          isLoading || !board ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <div className="p-6">
              <ListView board={board} />
            </div>
          )
        )}
        {activeView === 'calendar' && (
          isLoading || !board ? (
            <div className="p-6">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          ) : (
            <div className="p-6">
              <CalendarView board={board} />
            </div>
          )
        )}
      </motion.div>
    </div>
  )
}
