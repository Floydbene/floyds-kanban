import { useState } from 'react'
import { Bookmark, Trash2, Save, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useFilterStore } from '@/stores/filter-store'

export function FilterPresetMenu() {
  const { savedPresets, savePreset, loadPreset, deletePreset, search, priorities, types, labels, dueDateFilter } =
    useFilterStore()
  const [isNaming, setIsNaming] = useState(false)
  const [presetName, setPresetName] = useState('')

  const hasActiveFilters = search || priorities.length > 0 || types.length > 0 || labels.length > 0 || dueDateFilter

  const handleSave = () => {
    if (!presetName.trim()) return
    savePreset(presetName.trim())
    setPresetName('')
    setIsNaming(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Bookmark className="h-3.5 w-3.5" />
          Presets
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {savedPresets.map((preset) => (
          <DropdownMenuItem key={preset.id} className="flex items-center justify-between" onClick={() => loadPreset(preset.id)}>
            <span className="truncate">{preset.name}</span>
            <button
              className="ml-2 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                deletePreset(preset.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </DropdownMenuItem>
        ))}

        {savedPresets.length > 0 && hasActiveFilters && <DropdownMenuSeparator />}

        {hasActiveFilters && !isNaming && (
          <DropdownMenuItem onClick={() => setIsNaming(true)} className="gap-2">
            <Save className="h-3.5 w-3.5" />
            Save current filters
          </DropdownMenuItem>
        )}

        {isNaming && (
          <div className="flex gap-1.5 p-2" onClick={(e) => e.stopPropagation()}>
            <Input
              autoFocus
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="h-7 text-xs"
            />
            <Button size="sm" className="h-7 px-2 text-xs" onClick={handleSave}>
              Save
            </Button>
          </div>
        )}

        {savedPresets.length === 0 && !hasActiveFilters && (
          <div className="px-2 py-3 text-center text-xs text-muted-foreground">
            Apply filters first, then save as preset
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
