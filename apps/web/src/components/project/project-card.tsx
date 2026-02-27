import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { FolderKanban, MoreHorizontal, Pencil, Trash2, Tag, Check } from 'lucide-react'
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/confirm-dialog'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteProject } from '@/hooks/mutations/use-delete-project'
import { useProjectTags } from '@/hooks/queries/use-project-tags'
import { useToggleProjectTag } from '@/hooks/mutations/use-toggle-project-tag'
import { EditProjectDialog } from './edit-project-dialog'
import type { ProjectWithTags } from '@taskflow/shared'

interface ProjectCardProps {
  project: ProjectWithTags
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const deleteProject = useDeleteProject()
  const navigate = useNavigate()
  const { data: allTags } = useProjectTags()
  const toggleTag = useToggleProjectTag()
  const { confirm, dialogProps } = useConfirmDialog()

  const assignedTagIds = new Set(project.tags?.map((t) => t.id) ?? [])

  return (
    <>
      <Card className="transition-all hover:bg-accent/50 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Link to={`/projects/${project.slug}/board`} className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: project.color + '20', color: project.color }}
              >
                <FolderKanban className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base">{project.name}</CardTitle>
                {project.description && (
                  <CardDescription className="line-clamp-1">{project.description}</CardDescription>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{ backgroundColor: tag.color + '20', color: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={(e) => e.preventDefault()}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit project
                </DropdownMenuItem>
                {allTags && allTags.length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Tag className="mr-2 h-4 w-4" />
                      Tags
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {allTags.map((tag) => {
                        const isAssigned = assignedTagIds.has(tag.id)
                        return (
                          <DropdownMenuItem
                            key={tag.id}
                            onClick={() =>
                              toggleTag.mutate({
                                projectSlug: project.slug,
                                tagId: tag.id,
                                assigned: isAssigned,
                              })
                            }
                          >
                            <span
                              className="mr-2 h-3 w-3 shrink-0 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span className="flex-1">{tag.name}</span>
                            {isAssigned && <Check className="ml-2 h-3.5 w-3.5" />}
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() =>
                    confirm({
                      title: 'Delete project',
                      description: `Are you sure you want to delete "${project.name}"? This cannot be undone.`,
                      confirmLabel: 'Delete',
                      variant: 'destructive',
                      onConfirm: () => {
                        deleteProject.mutate(project.slug, {
                          onSuccess: () => navigate('/projects'),
                        })
                      },
                    })
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>
      <EditProjectDialog project={project} open={editOpen} onOpenChange={setEditOpen} />
      <ConfirmDialog {...dialogProps} />
    </>
  )
}
