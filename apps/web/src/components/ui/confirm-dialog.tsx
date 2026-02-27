import { useState, useCallback, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'destructive' | 'default'
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean
    title: string
    description?: string
    confirmLabel?: string
    variant?: 'destructive' | 'default'
    onConfirm: () => void
  }>({
    open: false,
    title: '',
    onConfirm: () => {},
  })

  const confirm = useCallback(
    (opts: {
      title: string
      description?: string
      confirmLabel?: string
      variant?: 'destructive' | 'default'
      onConfirm: () => void
    }) => {
      setState({ ...opts, open: true })
    },
    [],
  )

  const dialogProps = {
    ...state,
    onOpenChange: (open: boolean) => setState((s) => ({ ...s, open })),
  }

  return { confirm, dialogProps }
}
