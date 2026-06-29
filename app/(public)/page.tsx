'use client'

import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { SiteHeader } from './_components/site-header'
import { Hero } from './_components/hero'
import { TrustBar } from './_components/trust-bar'
import { ServicesSection } from './_components/services-section'
import { PremiumDifferentials } from './_components/premium-differentials'
import { BoutiqueShowcase } from './_components/boutique-showcase'
import { GallerySection } from './_components/gallery-section'
import { Testimonials } from './_components/testimonials'
import { HowItWorks } from './_components/how-it-works'
import { ClosingCTA } from './_components/closing-cta'
import { FAQSection } from './_components/faq-section'
import { SiteFooter } from './_components/site-footer'
import { BookingModal } from './_components/booking-modal'
import { ServiceType } from '@/types/database'

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultService, setDefaultService] = useState<ServiceType | undefined>()

  function handleBookingClick(serviceId?: ServiceType) {
    setDefaultService(serviceId)
    setModalOpen(true)
  }

  return (
    <>
      <SiteHeader onBookingClick={() => handleBookingClick()} />
      <main>
        <Hero onBookingClick={() => handleBookingClick()} />
        <TrustBar />
        <ServicesSection onBookingClick={handleBookingClick} />
        <PremiumDifferentials />
        <BoutiqueShowcase />
        <GallerySection />
        <Testimonials />
        <HowItWorks />
        <ClosingCTA onBookingClick={() => handleBookingClick()} />
        <FAQSection />
      </main>
      <SiteFooter />
      <BookingModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultService={defaultService}
      />
      <Toaster richColors position="top-right" />
    </>
  )
}
