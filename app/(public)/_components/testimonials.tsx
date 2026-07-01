import { Card, CardContent } from '@/components/ui/card'
import { TESTIMONIALS } from '@/lib/content/testimonials'

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 bg-bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-sans uppercase tracking-widest text-brand-accent">O que dizem</span>
          <h2 className="font-display text-4xl font-semibold text-ink">Depoimentos</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card key={t.id} className="border-line bg-bg-base">
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-brand-accent text-sm">★</span>
                  ))}
                </div>
                <p className="font-sans text-sm text-ink leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-display text-sm font-semibold text-ink">{t.name}</p>
                  <p className="font-sans text-xs text-ink-muted">{t.pet}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
