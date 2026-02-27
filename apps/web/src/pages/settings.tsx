import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/confirm-dialog'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/providers/theme-provider'
import { useAuth } from '@/providers/auth-provider'
import { useProjectTags } from '@/hooks/queries/use-project-tags'
import { useCreateProjectTag, useDeleteProjectTag } from '@/hooks/mutations/use-manage-project-tags'

const presetColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#14b8a6', '#84cc16',
]

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { data: tags } = useProjectTags()
  const createTag = useCreateProjectTag()
  const deleteTag = useDeleteProjectTag()

  const [tagName, setTagName] = useState('')
  const [tagColor, setTagColor] = useState(presetColors[0])
  const { confirm, dialogProps } = useConfirmDialog()

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagName.trim()) return

    createTag.mutate(
      { name: tagName.trim(), color: tagColor },
      {
        onSuccess: () => {
          setTagName('')
          setTagColor(presetColors[0])
        },
      },
    )
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="text-sm">{user?.name ?? '—'}</p>
            </div>
            <Separator />
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="text-sm">{user?.email ?? '—'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
            <CardDescription>Customize how Taskflow looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark mode</Label>
                <p className="text-sm text-muted-foreground">Toggle between dark and light theme</p>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Tags</CardTitle>
            <CardDescription>Global tags you can assign to any project</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ backgroundColor: tag.color + '20', color: tag.color }}
                  >
                    {tag.name}
                    <button
                      type="button"
                      className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                      onClick={() =>
                        confirm({
                          title: 'Delete tag',
                          description: `Are you sure you want to delete "${tag.name}"?`,
                          confirmLabel: 'Delete',
                          variant: 'destructive',
                          onConfirm: () => deleteTag.mutate(tag.id),
                        })
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <Separator />
            <form onSubmit={handleCreateTag} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Tag name"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!tagName.trim() || createTag.isPending}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      'h-6 w-6 rounded-full transition-transform',
                      tagColor === c && 'ring-2 ring-offset-2 ring-offset-background ring-primary scale-110',
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => setTagColor(c)}
                  />
                ))}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <ConfirmDialog {...dialogProps} />
    </div>
  )
}
