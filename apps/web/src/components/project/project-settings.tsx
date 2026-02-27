import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLabels } from '@/hooks/queries/use-labels'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { toast } from 'sonner'
import type { ApiResponse, Label as LabelType } from '@taskflow/shared'

const presetColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6',
]

interface ProjectSettingsProps {
  projectSlug: string
}

export function ProjectSettings({ projectSlug }: ProjectSettingsProps) {
  const { data: labels } = useLabels(projectSlug)
  const queryClient = useQueryClient()
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(presetColors[0])
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const createLabel = useMutation({
    mutationFn: (input: { name: string; color: string }) =>
      api.post<ApiResponse<LabelType>>(`/api/projects/${projectSlug}/labels`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels', projectSlug] })
      setNewName('')
      setNewColor(presetColors[0])
      toast.success('Label created')
    },
  })

  const deleteLabel = useMutation({
    mutationFn: (labelId: string) => api.delete(`/api/projects/${projectSlug}/labels/${labelId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels', projectSlug] })
      setDeleteConfirm(null)
      toast.success('Label deleted')
    },
  })

  const handleCreateLabel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    createLabel.mutate({ name: newName.trim(), color: newColor })
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Labels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleCreateLabel} className="flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs">Name</Label>
              <Input
                placeholder="Label name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Color</Label>
              <div className="flex gap-1">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      'h-6 w-6 rounded-full transition-transform',
                      newColor === c && 'ring-2 ring-offset-1 ring-offset-background ring-primary scale-110',
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => setNewColor(c)}
                  />
                ))}
              </div>
            </div>
            <Button type="submit" size="sm" className="h-8 gap-1.5" disabled={!newName.trim() || createLabel.isPending}>
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </form>

          <div className="space-y-2">
            {labels?.map((label) => (
              <div key={label.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: label.color }} />
                  <span className="text-sm">{label.name}</span>
                </div>
                {deleteConfirm === label.id ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Delete?</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => deleteLabel.mutate(label.id)}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      No
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteConfirm(label.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
            {(!labels || labels.length === 0) && (
              <p className="py-4 text-center text-sm text-muted-foreground">No labels yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
