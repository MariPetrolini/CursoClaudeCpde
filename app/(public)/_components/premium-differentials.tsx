import { ShieldCheck, Camera, Star } from 'lucide-react'

const DIFFERENTIALS = [
  { Icon: ShieldCheck, title: 'Profissionais certificados', description: 'Equipe com formação internacional e atualização contínua em bem-estar animal.' },
  { Icon: Camera, title: 'Câmeras 24h na hotelaria', description: 'Acompanhe seu pet em tempo real. Transparência e segurança em cada momento.' },
  { Icon: Star, title: 'Produtos importados', description: 'Selecionamos apenas cosméticos e insumos hipoalergênicos aprovados por veterinários.' },
]

export function PremiumDifferentials() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-sans uppercase tracking-widest text-brand-accent">Por que a Aurè</span>
          <h2 className="font-display text-4xl font-semibold text-ink">O padrão que faz a diferença</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {DIFFERENTIALS.map(({ Icon, title, description }) => (
            <div key={title} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-primary-soft">
                <Icon className="h-7 w-7 text-brand-primary-deep" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
              <p className="font-sans text-sm text-ink-muted leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
