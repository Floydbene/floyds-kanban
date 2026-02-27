import { useState } from 'react'
import { StatsCards } from './stats-cards'
import { ThroughputChart, CycleTimeChart, PriorityDistributionChart, LabelDistributionChart } from './charts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjects } from '@/hooks/queries/use-projects'

export function DashboardContent() {
  const { data: projects } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>()

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your work</p>
        </div>
        {projects && projects.length > 1 && (
          <Select value={selectedProjectId ?? 'all'} onValueChange={(v) => setSelectedProjectId(v === 'all' ? undefined : v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <StatsCards projectId={selectedProjectId} />

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ThroughputChart projectId={selectedProjectId} />
        <CycleTimeChart projectId={selectedProjectId} />
        <PriorityDistributionChart projectId={selectedProjectId} />
        <LabelDistributionChart projectId={selectedProjectId} />
      </div>
    </div>
  )
}
