import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BOUTIQUE_ITEMS } from '@/lib/content/boutique'

export function BoutiqueShowcase() {
  return (
    <section id="boutique" className="py-24 bg-bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-sans uppercase tracking-widest text-brand-accent">Seleção exclusiva</span>
          <h2 className="font-display text-4xl font-semibold text-ink">Nossa boutique</h2>
          <p className="font-sans text-ink-muted max-w-xl mx-auto">
            Uma curadoria cuidadosa dos melhores produtos para o seu pet.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {BOUTIQUE_ITEMS.map((item) => (
            <Card key={item.id} className="border-line bg-bg-base">
              <div className="aspect-video bg-surface rounded-t-lg flex items-center justify-center">
                <span className="text-ink-muted text-xs font-sans">Foto do produto</span>
              </div>
              <CardHeader className="pb-2">
                <Badge variant="secondary" className="w-fit text-xs bg-brand-primary-soft text-brand-primary-deep border-0">
                  {item.category}
                </Badge>
                <h3 className="font-display text-base font-semibold text-ink mt-2">{item.name}</h3>
              </CardHeader>
              <CardContent>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button
            variant="outline"
            nativeButton={false}
            className="border-line text-ink hover:bg-surface transition-colors"
            render={<a href="#contato" />}
          >
            Conhecer a boutique completa
          </Button>
        </div>
      </div>
    </section>
  )
}
