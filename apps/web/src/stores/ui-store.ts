import { create } from 'zustand'

type ActiveView = 'board' | 'list' | 'calendar'

interface UiState {
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  activeView: ActiveView
  selectedTaskId: string | null
  taskPanelOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setCommandPaletteOpen: (open: boolean) => void
  setActiveView: (view: ActiveView) => void
  setSelectedTaskId: (id: string | null) => void
  setTaskPanelOpen: (open: boolean) => void
  openTask: (id: string) => void
  closeTaskPanel: () => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  activeView: 'board',
  selectedTaskId: null,
  taskPanelOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setActiveView: (view) => set({ activeView: view }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  setTaskPanelOpen: (open) => set({ taskPanelOpen: open }),
  openTask: (id) => set({ selectedTaskId: id, taskPanelOpen: true }),
  closeTaskPanel: () => set({ selectedTaskId: null, taskPanelOpen: false }),
}))
