import { UserCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@taskflow/shared'

interface TaskRequestorSelectProps {
  requestor: Pick<User, 'id' | 'name' | 'avatarUrl'> | null
  users: Pick<User, 'id' | 'name' | 'avatarUrl'>[]
  onChange: (userId: string | null) => void
}

export function TaskRequestorSelect({ requestor, users, onChange }: TaskRequestorSelectProps) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">Requestor</span>
      <Select
        value={requestor?.id ?? '_none'}
        onValueChange={(v) => onChange(v === '_none' ? null : v)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_none">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              No requestor
            </div>
          </SelectItem>
          {users.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              <div className="flex items-center gap-2">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={u.avatarUrl ?? undefined} alt={u.name} />
                  <AvatarFallback className="text-[8px]">
                    {u.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {u.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
