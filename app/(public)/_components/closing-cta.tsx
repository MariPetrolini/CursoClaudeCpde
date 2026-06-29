'use client'

import { Button } from '@/components/ui/button'

type ClosingCTAProps = { onBookingClick: () => void }

export function ClosingCTA({ onBookingClick }: ClosingCTAProps) {
  return (
    <section className="py-24 bg-brand-primary-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-white">
          Seu pet merece o melhor.
        </h2>
        <p className="font-sans text-lg text-white/80 max-w-xl mx-auto">
          Agende agora e descubra o cuidado Aurè.
        </p>
        <Button
          onClick={onBookingClick}
          size="lg"
          className="bg-white text-brand-primary-deep hover:bg-bg-warm transition-colors px-10 font-semibold"
        >
          Agendar atendimento
        </Button>
      </div>
    </section>
  )
}
