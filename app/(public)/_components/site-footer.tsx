export function SiteFooter() {
  return (
    <footer id="contato" className="bg-ink py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <div>
              <p className="font-display text-xl font-semibold text-white">Aurè</p>
              <p className="text-xs font-sans text-white/50 tracking-widest uppercase">Pet Atelier</p>
            </div>
            <p className="font-sans text-sm text-white/60 leading-relaxed max-w-xs">
              O cuidado que seu melhor amigo merece.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold text-white">Navegação</h3>
            <nav className="flex flex-col gap-2">
              {['Serviços', 'Boutique', 'Depoimentos', 'FAQ', 'Contato'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}`}
                  className="font-sans text-sm text-white/60 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold text-white">Contato</h3>
            <div className="space-y-2 font-sans text-sm text-white/60">
              <p>
                <a href="https://wa.me/5511988775522" className="hover:text-white transition-colors">
                  (11) 98877-5522
                </a>
              </p>
              <p>São Paulo, SP</p>
              <p>Seg–Sáb, 8h–19h</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-white/40">
            © 2026 Aurè Pet Atelier. Todos os direitos reservados.
          </p>
          <p className="font-sans text-xs text-white/40">
            Seus dados são tratados conforme a LGPD.
          </p>
        </div>
      </div>
    </footer>
  )
}
