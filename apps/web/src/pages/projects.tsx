import { Plus, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjects } from '@/hooks/queries/use-projects'
import { ProjectCard } from '@/components/project/project-card'
import { CreateProjectDialog } from '@/components/project/create-project-dialog'

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects()

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage and organize your work</p>
        </div>
        <CreateProjectDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))
          : projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
      </div>

      {!isLoading && projects?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderKanban className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-1 text-lg font-medium">No projects yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Create your first project to get started
          </p>
          <CreateProjectDialog
            trigger={
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New project
              </Button>
            }
          />
        </div>
      )}
    </div>
  )
}
