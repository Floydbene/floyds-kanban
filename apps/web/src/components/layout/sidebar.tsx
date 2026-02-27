import { Link, useLocation, useParams } from 'react-router'
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  ChevronLeft,
  Plus,
  Hash,
  Rocket,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from './theme-toggle'
import { useUiStore } from '@/stores/ui-store'
import { useAuth } from '@/providers/auth-provider'
import { useProjects } from '@/hooks/queries/use-projects'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', shortcut: 'G D' },
  { label: 'All Tasks', icon: Layers, href: '/all-tasks', shortcut: 'G A' },
  { label: 'Projects', icon: FolderKanban, href: '/projects', shortcut: 'G P' },
  { label: 'Settings', icon: Settings, href: '/settings', shortcut: 'G S' },
  { label: "Floyd's Prod", icon: Rocket, href: '/cheatsheet', shortcut: 'G F' },
]

export function Sidebar() {
  const location = useLocation()
  const params = useParams()
  const { toggleSidebar } = useUiStore()
  const { user } = useAuth()
  const { data: projects, isLoading: projectsLoading } = useProjects()

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-bold text-primary-foreground">T</span>
          </div>
          <span className="text-sm font-semibold text-foreground">Taskflow</span>
        </Link>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleSidebar}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-accent/50 hover:text-accent-foreground',
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                <kbd className="hidden text-[10px] text-muted-foreground lg:inline">
                  {item.shortcut}
                </kbd>
              </Link>
            )
          })}
        </nav>

        <Separator className="my-4" />

        <div className="mb-2 flex items-center justify-between px-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground">
            Projects
          </span>
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <nav className="flex flex-col gap-1">
          {projectsLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="mx-3 h-8 rounded-md" />
              ))
            : projects?.map((project) => {
                const isActive = params.slug === project.slug
                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.slug}/board`}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-accent/50 hover:text-accent-foreground',
                    )}
                  >
                    <Hash className="h-3.5 w-3.5" style={{ color: project.color }} />
                    <span className="truncate">{project.name}</span>
                  </Link>
                )
              })}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3">
          {user && (
            <>
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                <AvatarFallback className="text-[10px]">
                  {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-sidebar-foreground">{user.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
              </div>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
