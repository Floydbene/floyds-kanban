import { CombinedKanban } from '@/components/kanban/combined-kanban'

export function AllTasksPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-semibold tracking-tight">All Tasks</h1>
        <p className="text-sm text-muted-foreground">Combined kanban view across all projects</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <CombinedKanban />
      </div>
    </div>
  )
}
