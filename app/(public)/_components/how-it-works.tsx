const STEPS = [
  { number: '01', title: 'Agende', description: 'Preencha o formulário em segundos com o serviço e a data desejada.' },
  { number: '02', title: 'Confirmamos', description: 'Nossa equipe entra em contato em até 24h para confirmar os detalhes.' },
  { number: '03', title: 'Cuidamos', description: 'Seu pet recebe atenção individualizada em nosso espaço premium.' },
  { number: '04', title: 'Felicidade', description: 'Seu companheiro retorna feliz, relaxado e muito bem cuidado.' },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-sans uppercase tracking-widest text-brand-accent">Simples assim</span>
          <h2 className="font-display text-4xl font-semibold text-ink">Como funciona</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center space-y-4">
              <span className="font-display text-5xl font-semibold text-brand-primary-soft">{step.number}</span>
              <h3 className="font-display text-xl font-semibold text-ink">{step.title}</h3>
              <p className="font-sans text-sm text-ink-muted leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
