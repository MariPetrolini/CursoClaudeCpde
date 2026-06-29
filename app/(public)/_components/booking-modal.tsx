'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { BookingForm } from './booking-form'
import { ServiceType } from '@/types/database'

type BookingModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultService?: ServiceType
}

export function BookingModal({ open, onOpenChange, defaultService }: BookingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-ink">Agendar atendimento</DialogTitle>
          <DialogDescription className="text-ink-muted">
            Preencha os dados abaixo. Nossa equipe entrará em contato em até 24h.
          </DialogDescription>
        </DialogHeader>
        <BookingForm
          defaultService={defaultService}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
