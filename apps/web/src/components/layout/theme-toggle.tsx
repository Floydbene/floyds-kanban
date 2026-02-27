import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/providers/theme-provider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-3 text-sidebar-foreground"
      onClick={toggleTheme}
    >
      <div className="relative h-4 w-4">
        <Sun
          className="absolute inset-0 h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"
        />
        <Moon
          className="absolute inset-0 h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
        />
      </div>
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </Button>
  )
}
