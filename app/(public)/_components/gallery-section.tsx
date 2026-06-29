const GALLERY_ITEMS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  label: i % 2 === 0 ? 'Espaço de atendimento' : 'Pet atendido',
  aspect: i % 3 === 0 ? 'aspect-square' : 'aspect-[4/3]',
}))

export function GallerySection() {
  return (
    <section className="py-24 bg-bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-sans uppercase tracking-widest text-brand-accent">Nosso espaço</span>
          <h2 className="font-display text-4xl font-semibold text-ink">A experiência Aurè</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY_ITEMS.map((item) => (
            <div key={item.id} className={`${item.aspect} bg-surface rounded-xl flex items-center justify-center`}>
              <span className="text-ink-muted text-xs font-sans">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
