import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'

interface SortableItemProps {
  id: string
  children: (props: {
    setNodeRef: (node: HTMLElement | null) => void
    attributes: Record<string, any>
    listeners: Record<string, unknown> | undefined
    style: React.CSSProperties
    isDragging: boolean
  }) => ReactNode
}

export function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return <>{children({ setNodeRef, attributes, listeners, style, isDragging })}</>
}
