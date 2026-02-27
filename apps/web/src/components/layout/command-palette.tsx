import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Plus,
  Search,
  FileText,
} from 'lucide-react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { useUiStore } from '@/stores/ui-store'
import { useProjects } from '@/hooks/queries/use-projects'

export function CommandPalette() {
  const navigate = useNavigate()
  const { commandPaletteOpen, setCommandPaletteOpen } = useUiStore()
  const { data: projects } = useProjects()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  const runCommand = (command: () => void) => {
    setCommandPaletteOpen(false)
    command()
  }

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {projects && projects.length > 0 && (
          <CommandGroup heading="Projects">
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() =>
                  runCommand(() => navigate(`/projects/${project.slug}/board`))
                }
              >
                <FolderKanban className="mr-2 h-4 w-4" style={{ color: project.color }} />
                {project.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => navigate('/projects'))
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
            <CommandShortcut>P</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setCommandPaletteOpen(false)
              // Focus the first add-card input if on a board view
              const addCardBtn = document.querySelector<HTMLButtonElement>(
                '[data-add-card-trigger]',
              )
              if (addCardBtn) addCardBtn.click()
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            New Task
            <CommandShortcut>C</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate('/dashboard'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
            <CommandShortcut>G then D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/projects'))}>
            <FolderKanban className="mr-2 h-4 w-4" />
            Projects
            <CommandShortcut>G then P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
            <CommandShortcut>G then S</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => setCommandPaletteOpen(true))}
          >
            <Search className="mr-2 h-4 w-4" />
            Search
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
