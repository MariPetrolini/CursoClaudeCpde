import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FAQ_ITEMS } from '@/lib/content/faq'

export function FAQSection() {
  return (
    <section className="py-24 bg-bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-sans uppercase tracking-widest text-brand-accent">Dúvidas</span>
          <h2 className="font-display text-4xl font-semibold text-ink">Perguntas frequentes</h2>
        </div>
        <Accordion className="max-w-2xl mx-auto space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-line rounded-lg px-4 bg-bg-base">
              <AccordionTrigger className="font-sans text-sm font-medium text-ink hover:no-underline py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="font-sans text-sm text-ink-muted pb-4 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
