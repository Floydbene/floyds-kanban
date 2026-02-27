import { useParams } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { useBoard } from '@/hooks/queries/use-board'
import { FilterBar } from '@/components/filters/filter-bar'
import { FilterPresetMenu } from '@/components/filters/filter-preset-menu'
import { ViewSwitcher } from '@/components/views/view-switcher'
import { ListView } from '@/components/views/list-view'

export function ListPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: board, isLoading } = useBoard(slug!)

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    )
  }

  if (!board) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Board not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center gap-2">
        <FilterBar projectSlug={slug!} />
        <FilterPresetMenu />
        <div className="flex-1" />
        <ViewSwitcher />
      </div>
      <ListView board={board} />
    </div>
  )
}
