import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TaskPriority, TaskType } from '@taskflow/shared'

interface FilterPreset {
  id: string
  name: string
  search: string
  priorities: TaskPriority[]
  types: TaskType[]
  labels: string[]
  dueDateFilter: DueDateFilter | null
}

type DueDateFilter = 'overdue' | 'today' | 'this-week' | 'no-date'

interface FilterState {
  search: string
  priorities: TaskPriority[]
  types: TaskType[]
  labels: string[]
  dueDateFilter: DueDateFilter | null
  savedPresets: FilterPreset[]
  setSearch: (search: string) => void
  togglePriority: (priority: TaskPriority) => void
  toggleType: (type: TaskType) => void
  toggleLabel: (labelId: string) => void
  setDueDateFilter: (filter: DueDateFilter | null) => void
  clearFilters: () => void
  savePreset: (name: string) => void
  loadPreset: (id: string) => void
  deletePreset: (id: string) => void
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      search: '',
      priorities: [],
      types: [],
      labels: [],
      dueDateFilter: null,
      savedPresets: [],
      setSearch: (search) => set({ search }),
      togglePriority: (priority) =>
        set((s) => ({
          priorities: s.priorities.includes(priority)
            ? s.priorities.filter((p) => p !== priority)
            : [...s.priorities, priority],
        })),
      toggleType: (type) =>
        set((s) => ({
          types: s.types.includes(type)
            ? s.types.filter((t) => t !== type)
            : [...s.types, type],
        })),
      toggleLabel: (labelId) =>
        set((s) => ({
          labels: s.labels.includes(labelId)
            ? s.labels.filter((l) => l !== labelId)
            : [...s.labels, labelId],
        })),
      setDueDateFilter: (filter) => set({ dueDateFilter: filter }),
      clearFilters: () => set({ search: '', priorities: [], types: [], labels: [], dueDateFilter: null }),
      savePreset: (name) => {
        const state = get()
        const preset: FilterPreset = {
          id: crypto.randomUUID(),
          name,
          search: state.search,
          priorities: state.priorities,
          types: state.types,
          labels: state.labels,
          dueDateFilter: state.dueDateFilter,
        }
        set((s) => ({ savedPresets: [...s.savedPresets, preset] }))
      },
      loadPreset: (id) => {
        const preset = get().savedPresets.find((p) => p.id === id)
        if (preset) {
          set({
            search: preset.search,
            priorities: preset.priorities,
            types: preset.types ?? [],
            labels: preset.labels,
            dueDateFilter: preset.dueDateFilter,
          })
        }
      },
      deletePreset: (id) =>
        set((s) => ({ savedPresets: s.savedPresets.filter((p) => p.id !== id) })),
    }),
    { name: 'taskflow-filters' },
  ),
)
