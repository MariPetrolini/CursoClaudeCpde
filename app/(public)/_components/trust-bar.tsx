const TRUST_ITEMS = [
  { value: '10+', label: 'anos de experiência' },
  { value: '+2.000', label: 'pets atendidos' },
  { value: '100%', label: 'produtos importados' },
  { value: 'Certificados', label: 'profissionais especializados' },
]

export function TrustBar() {
  return (
    <section className="bg-bg-warm border-y border-line py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="font-display text-2xl font-semibold text-ink">{item.value}</p>
              <p className="font-sans text-sm text-ink-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
