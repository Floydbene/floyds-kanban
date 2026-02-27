import { ListTodo, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSummary } from '@/hooks/queries/use-dashboard'

const statConfig = [
  { key: 'totalTasks' as const, label: 'Total Tasks', icon: ListTodo, accent: 'text-indigo-500' },
  { key: 'completedThisWeek' as const, label: 'Completed This Week', icon: CheckCircle2, accent: 'text-emerald-500' },
  { key: 'inProgress' as const, label: 'In Progress', icon: Clock, accent: 'text-amber-500' },
  { key: 'overdue' as const, label: 'Overdue', icon: AlertTriangle, accent: 'text-red-500' },
]

export function StatsCards({ projectId }: { projectId?: string }) {
  const { data: summary, isLoading } = useSummary(projectId)

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statConfig.map((stat) => (
        <Card key={stat.key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.accent}`} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary?.[stat.key] ?? '—'}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
