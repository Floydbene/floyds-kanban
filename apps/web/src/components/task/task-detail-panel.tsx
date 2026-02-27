import { useParams } from 'react-router'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useUiStore } from '@/stores/ui-store'
import { useTimerStore } from '@/stores/timer-store'
import { useAuth } from '@/providers/auth-provider'
import { useTask } from '@/hooks/queries/use-task'
import { useSubtasks } from '@/hooks/queries/use-subtasks'
import { useComments } from '@/hooks/queries/use-comments'
import { useLabels } from '@/hooks/queries/use-labels'
import { useTimeEntries } from '@/hooks/queries/use-time-entries'
import { useDeleteTask } from '@/hooks/mutations/use-delete-task'
import { useUpdateTask } from '@/hooks/mutations/use-update-task'
import { useUpdateSubtask } from '@/hooks/mutations/use-update-subtask'
import { useCreateSubtask } from '@/hooks/mutations/use-create-subtask'
import { useDeleteSubtask } from '@/hooks/mutations/use-delete-subtask'
import { useCreateComment } from '@/hooks/mutations/use-create-comment'
import { useUpdateComment } from '@/hooks/mutations/use-update-comment'
import { useDeleteComment } from '@/hooks/mutations/use-delete-comment'
import { useResources } from '@/hooks/queries/use-resources'
import { useCreateResource } from '@/hooks/mutations/use-create-resource'
import { useDeleteResource } from '@/hooks/mutations/use-delete-resource'
import { useToggleLabel } from '@/hooks/mutations/use-toggle-label'
import { useStartTimer, useStopTimer } from '@/hooks/mutations/use-time-entry'
import { TaskTitle } from './task-title'
import { TaskDescription } from './task-description'
import { TaskPrioritySelect } from './task-priority'
import { TaskTypeSelect } from './task-type-select'
import { TaskLabels } from './task-labels'
import { TaskDueDate } from './task-due-date'
import { TaskSubtasks } from './task-subtasks'
import { TaskTimeTracker } from './task-time-tracker'
import { TaskResources } from './task-resources'
import { TaskBlocked } from './task-blocked'
import { TaskComments } from './task-comments'
import { TaskResolutionSelect } from './task-resolution-select'
import { TaskAssigneeSelect } from './task-assignee'
import { TaskRequestorSelect } from './task-requestor'
import { useUsers } from '@/hooks/queries/use-users'

function PanelSkeleton() {
  return (
    <div className="flex h-full gap-6 p-6">
      <div className="flex-1 space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="w-[200px] space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  )
}

export function TaskDetailPanel() {
  const { slug: projectSlug } = useParams<{ slug: string }>()
  const { selectedTaskId, taskPanelOpen, closeTaskPanel } = useUiStore()
  const { user } = useAuth()
  const timerStore = useTimerStore()

  const { data: task, isLoading: taskLoading } = useTask(selectedTaskId)
  const { data: subtasks = [] } = useSubtasks(selectedTaskId)
  const { data: comments = [] } = useComments(selectedTaskId)
  const { data: allLabels = [] } = useLabels(projectSlug ?? '')
  const { data: timeEntries = [] } = useTimeEntries(selectedTaskId)
  const { data: resources = [] } = useResources(selectedTaskId)
  const { data: users = [] } = useUsers()

  const deleteTask = useDeleteTask(projectSlug ?? '')
  const updateTask = useUpdateTask(projectSlug ?? '')
  const updateSubtask = useUpdateSubtask()
  const createSubtask = useCreateSubtask()
  const deleteSubtask = useDeleteSubtask()
  const createComment = useCreateComment()
  const updateComment = useUpdateComment()
  const deleteComment = useDeleteComment()
  const createResource = useCreateResource()
  const deleteResource = useDeleteResource()
  const toggleLabel = useToggleLabel()
  const startTimer = useStartTimer()
  const stopTimer = useStopTimer()
  const { confirm, dialogProps } = useConfirmDialog()

  return (
    <>
    <Sheet open={taskPanelOpen} onOpenChange={(open) => !open && closeTaskPanel()}>
      <SheetContent
        side="right"
        className="w-full max-w-none overflow-hidden p-0 sm:max-w-[600px]"
      >
        <SheetTitle className="sr-only">Task details</SheetTitle>
        {taskLoading || !task ? (
          <PanelSkeleton />
        ) : (
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-6 p-6 sm:flex-row">
              {/* Main content */}
              <div className="min-w-0 flex-1 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="mb-1 text-xs font-medium text-muted-foreground">
                      {task.identifier}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        confirm({
                          title: 'Delete task',
                          description: `Are you sure you want to delete "${task.title}"? This cannot be undone.`,
                          confirmLabel: 'Delete',
                          variant: 'destructive',
                          onConfirm: () => {
                            deleteTask.mutate(task.id)
                            closeTaskPanel()
                          },
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <TaskTitle
                    title={task.title}
                    onSave={(title) =>
                      updateTask.mutate({ taskId: task.id, title })
                    }
                  />
                </div>

                <TaskBlocked
                  isBlocked={task.isBlocked}
                  blockedReason={task.blockedReason}
                  onChange={(isBlocked, blockedReason) =>
                    updateTask.mutate({ taskId: task.id, isBlocked, blockedReason })
                  }
                />

                <TaskDescription
                  description={task.description}
                  onSave={(description) =>
                    updateTask.mutate({ taskId: task.id, description })
                  }
                />

                <Separator />

                <TaskResources
                  resources={resources}
                  onCreate={(title, url, resourceType) =>
                    createResource.mutate({ taskId: task.id, title, url, resourceType })
                  }
                  onDelete={(resourceId) =>
                    deleteResource.mutate({ resourceId, taskId: task.id })
                  }
                />

                <Separator />

                <TaskSubtasks
                  subtasks={subtasks}
                  onToggle={(subtaskId, isCompleted) =>
                    updateSubtask.mutate({ subtaskId, taskId: task.id, isCompleted })
                  }
                  onUpdateTitle={(subtaskId, title) =>
                    updateSubtask.mutate({ subtaskId, taskId: task.id, title })
                  }
                  onCreate={(title) => createSubtask.mutate({ taskId: task.id, title })}
                  onDelete={(subtaskId) =>
                    deleteSubtask.mutate({ subtaskId, taskId: task.id })
                  }
                />

                <Separator />

                <TaskComments
                  comments={comments}
                  currentUserId={user?.id ?? null}
                  onCreate={(content) =>
                    createComment.mutate({ taskId: task.id, content })
                  }
                  onUpdate={(commentId, content) =>
                    updateComment.mutate({ commentId, taskId: task.id, content })
                  }
                  onDelete={(commentId) =>
                    deleteComment.mutate({ commentId, taskId: task.id })
                  }
                />
              </div>

              {/* Metadata sidebar */}
              <div className="w-full shrink-0 space-y-5 sm:w-[200px]">
                <TaskTypeSelect
                  type={task.type}
                  onChange={(type) =>
                    updateTask.mutate({ taskId: task.id, type })
                  }
                />

                <TaskAssigneeSelect
                  assignee={task.assignee}
                  users={users}
                  onChange={(assigneeId) =>
                    updateTask.mutate({ taskId: task.id, assigneeId })
                  }
                />

                <TaskRequestorSelect
                  requestor={task.requestor}
                  users={users}
                  onChange={(requestorId) =>
                    updateTask.mutate({ taskId: task.id, requestorId })
                  }
                />

                <TaskPrioritySelect
                  priority={task.priority}
                  onChange={(priority) =>
                    updateTask.mutate({ taskId: task.id, priority })
                  }
                />

                <TaskLabels
                  taskLabels={task.labels}
                  allLabels={allLabels}
                  onToggle={(labelId, isActive) =>
                    toggleLabel.mutate({ taskId: task.id, labelId, isActive })
                  }
                />

                <TaskDueDate
                  dueDate={task.dueDate}
                  onChange={(dueDate) =>
                    updateTask.mutate({ taskId: task.id, dueDate } as any)
                  }
                />

                <TaskResolutionSelect
                  resolution={task.resolution}
                  onChange={(resolution) =>
                    updateTask.mutate({ taskId: task.id, resolution })
                  }
                />

                {task.estimatePoints !== null && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Story points</span>
                    <p className="text-sm">{task.estimatePoints}</p>
                  </div>
                )}

                <TaskTimeTracker
                  taskId={task.id}
                  timeEntries={timeEntries}
                  onStart={() => {
                    timerStore.start(task.id)
                    startTimer.mutate(task.id)
                  }}
                  onStop={() => {
                    timerStore.stop()
                    timerStore.reset()
                    stopTimer.mutate()
                  }}
                />
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
    <ConfirmDialog {...dialogProps} />
  </>
  )
}
