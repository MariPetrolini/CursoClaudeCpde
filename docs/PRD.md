# PRD — Aurè Pet Atelier

**Versão:** 1.0  
**Data:** 2026-06-28  
**Status:** Aguardando revisão e aprovação do stakeholder  
**Autores:** Product Manager + Tech Lead  

---

## 1. Visão geral

**Aurè — Pet Atelier** é uma plataforma web de vitrine e captação de leads para um pet shop de luxo. O objetivo desta entrega é comunicar o posicionamento premium da marca, apresentar os serviços e produtos, e converter visitantes em leads qualificados por meio de um formulário de agendamento. Os dados captados são armazenados em banco de dados e disponibilizados a um painel administrativo com analytics.

**Tagline:** "O cuidado que seu melhor amigo merece."

---

## 2. Objetivos do produto

| # | Objetivo | Métrica | Meta |
|---|----------|---------|------|
| O1 | Comunicar posicionamento premium | Teste de 5 segundos: % que descreve como "sofisticada/premium" | ≥ 80% |
| O2 | Converter visitantes em leads | Taxa de clique no CTA primário / sessões | ≥ 6% |
| O3 | Taxa de conclusão do formulário | Envios ÷ formulários iniciados | ≥ 40% |
| O4 | Desempenho técnico | LCP ≤ 2,5s, CLS ≤ 0,1, INP ≤ 200ms (p75 mobile) | Core Web Vitals "Good" |
| O5 | Acessibilidade | WCAG 2.1 nível AA | Conformidade nos elementos da home |
| O6 | Responsividade | Sem overflow ou sobreposição | 360px a 1440px |

---

## 3. Público-alvo e personas

### Persona primária — Tutor Premium
- **Quem:** 30–55 anos, classe A/B, trata o pet como membro da família
- **Valores:** confiança, estética, conveniência acima do preço
- **Comportamento:** acessa via mobile, frequentemente por indicação ou busca; compara 2–4 opções rapidamente
- **Necessidade na home:** verificar em segundos que o lugar é confiável e à altura, e agendar sem fricção

### Persona secundária — Presenteador / Tutor Ocasional
- **Quem:** Compra experiência ou produto premium pontualmente (spa day, kit presente)
- **Necessidade:** entender a oferta e iniciar contato facilmente

### Ator interno — Operador do negócio
- **Quem:** Dono/gestor do Aurè
- **Necessidade:** receber leads qualificados pelo admin, acompanhar analytics, atualizar status dos agendamentos

---

## 4. Escopo desta entrega

### Dentro do escopo
- Home page completa (vitrine institucional premium)
- Formulário de agendamento com captação de lead
- Banco de dados Supabase para armazenar leads
- Painel administrativo protegido com dashboard, lista de leads e detalhes
- Autenticação de admin (Supabase Auth, provisionamento manual)
- Gráficos e analytics consolidados no painel

### Fora do escopo
- Carrinho de compras, checkout e pagamento online
- Catálogo de produtos navegável com estoque
- Área logada para tutores (clientes finais)
- Integração com sistema externo de agendamento / CRM
- Notificação automática via WhatsApp ao receber lead
- Blog / conteúdo editorial
- Múltiplos idiomas (apenas pt-BR)
- Aplicativo mobile nativo
- Gestão de catálogo de serviços pelo admin (catálogo fixo nesta entrega)
- Signup público de admin (provisionamento manual no Supabase)

---

## 5. Funcionalidades por módulo

### Módulo A — Home Page

#### A1. Header / Navegação
- Logo Aurè com link para o topo
- Links de navegação: Serviços, Boutique, Depoimentos, Contato
- CTA primário "Agendar atendimento" (abre formulário)
- Sticky ao rolar; transparente sobre o hero, sólido após scroll
- Menu colapsável (drawer/Sheet) em mobile < 768px

#### A2. Hero
- Proposta de valor principal com headline e subheadline
- Imagem de destaque (pet em ambiente elegante, tratamento âmbar/quente)
- CTA primário "Agendar atendimento"
- CTA secundário "Conhecer serviços" (scroll âncora)

#### A3. Trust Bar
- Faixa compacta com selos: anos de experiência, pets atendidos, avaliação, outros diferenciais numéricos
- Conteúdo estático (dados reais a definir pelo stakeholder — ver seção 10)

#### A4. Serviços
- 6 cards de serviço: Banho & Tosa Premium, Spa & Estética, Hotelaria, Day Care, Taxi-Dog, Boutique Curadoria
- Cada card: ícone, título, descrição curta, botão "Agendar" (pré-seleciona serviço no formulário)

#### A5. Diferenciais Premium
- Seção com 3–4 diferenciais de luxo (ex.: produtos importados, profissionais certificados, ambiente climatizado, câmeras 24h)
- Layout horizontal com ícone e texto

#### A6. Boutique / Produtos em Destaque
- 3–6 produtos curados em cards visuais
- Sem preço, sem botão de compra, sem checkout
- CTA: "Conhecer boutique" → formulário ou contato

#### A7. Galeria
- Grid de fotos do espaço e dos pets atendidos
- Lightbox opcional ao clicar

#### A8. Depoimentos
- 3–5 depoimentos de clientes reais (texto + nome + pet)
- Carrossel ou grid

#### A9. Como Funciona
- Passo a passo numerado: 1. Agendar → 2. Check-in → 3. Cuidado premium → 4. Retirada feliz

#### A10. CTA de Fechamento
- Faixa terracota (#C25E1A) com headline de urgência/convite e CTA primário

#### A11. FAQ
- 5–8 perguntas frequentes em accordion (shadcn/ui Accordion)

#### A12. Footer
- Logo, descrição curta da marca
- Links: Serviços, Boutique, FAQ, Contato
- WhatsApp: 11 988775522
- Endereço: a definir (placeholder)
- Horários: a definir (placeholder)
- Redes sociais: a definir (placeholder)
- Aviso de privacidade / LGPD

---

### Módulo B — Formulário de Agendamento

#### B1. Campos
| Campo | Tipo | Obrigatório | Validação |
|-------|------|-------------|-----------|
| Nome completo | text | Sim | min 3 chars |
| Telefone / WhatsApp | tel | Sim | formato BR (10–11 dígitos) |
| E-mail | email | Não | formato válido se preenchido |
| Serviço de interesse | select | Sim | um dos 6 serviços |
| Data preferida | date | Não | data futura ou vazia |
| Mensagem | textarea | Não | max 500 chars |
| Consentimento LGPD | checkbox | Sim | deve estar marcado |

#### B2. Comportamento
- Validação no cliente (React Hook Form + Zod) com mensagens por campo
- Validação no servidor (Zod na Server Action)
- Ao enviar com sucesso: toast de confirmação, formulário limpo/bloqueado para reenvio
- Ao falhar (erro de servidor): toast de erro, dados preservados, alternativa de contato exibida (WhatsApp)
- Serviço pré-selecionado quando acionado a partir de um card de serviço

---

### Módulo C — Painel Administrativo

#### C1. Autenticação
- Rota `/login`: formulário de e-mail e senha (Supabase Auth)
- Após login bem-sucedido: redirect para `/admin`
- Logout: Server Action, limpeza de cookies, redirect para `/login`
- Rotas `/admin/*` protegidas por middleware + validação no layout

#### C2. Dashboard (`/admin`)
- **Cards de métricas:** Total de leads, Leads hoje, Taxa de confirmação (confirmados / total), Serviço mais solicitado
- **Gráfico de área:** Leads por dia nos últimos 30 dias
- **Gráfico de barras:** Total de leads por serviço
- **Gráfico donut:** Distribuição por status (pendente, confirmado, concluído, cancelado)

#### C3. Lista de Leads (`/admin/leads`)
- Tabela com colunas: Nome, Telefone, Serviço, Data preferida, Status, Data do lead
- Filtros: por status, por serviço, por período (data início / data fim)
- Paginação (20 itens por página)
- Clique na linha → detalhe do lead

#### C4. Detalhe do Lead (`/admin/leads/[id]`)
- Todos os dados do lead
- Seletor de status (pendente → confirmado → concluído / cancelado)
- Botão "Salvar status" (Server Action updateLeadStatus)
- Confirmação visual (toast)
- Botão "Voltar para lista"

---

## 6. Requisitos Funcionais

| ID | Módulo | Requisito |
|----|--------|-----------|
| RF-001 | A | A home deve renderizar as 12 seções na ordem definida na seção 5-A |
| RF-002 | A1 | O header deve ser sticky, com âncoras para Serviços, Boutique, Depoimentos e Contato |
| RF-003 | A1 | Em viewport < 768px, a navegação deve colapsar em menu drawer (Sheet) |
| RF-004 | A1, A2, A10 | O CTA "Agendar atendimento" deve estar no header, hero e faixa de fechamento, todos disparando o mesmo formulário |
| RF-005 | A4 | Clicar em "Agendar" em um card de serviço deve abrir o formulário com aquele serviço pré-selecionado |
| RF-006 | A6 | A seção de boutique não deve exibir preço, botão de compra, carrinho ou checkout |
| RF-007 | A12 | O footer deve exibir WhatsApp, endereço, horários e links de redes sociais (placeholders permitidos nesta entrega) |
| RF-008 | B | O formulário deve capturar nome, telefone, e-mail, serviço, data preferida, mensagem e consentimento LGPD |
| RF-009 | B | O formulário deve validar campos no cliente (RHF + Zod) e no servidor (Zod na Server Action) |
| RF-010 | B | Envio bem-sucedido deve confirmar visualmente (toast) e bloquear reenvio imediato |
| RF-011 | B | Falha de servidor deve exibir erro com alternativa de contato e preservar dados digitados |
| RF-012 | B | Lead enviado deve ser gravado na tabela `leads` do Supabase com status `pendente` |
| RF-013 | C1 | Rotas `/admin/*` devem redirecionar para `/login` se o usuário não estiver autenticado |
| RF-014 | C1 | Logout deve limpar a sessão e redirecionar para `/login` |
| RF-015 | C2 | O dashboard deve exibir os 4 cards de métricas, o gráfico de área (série temporal), o de barras (por serviço) e o donut (por status) |
| RF-016 | C3 | A lista de leads deve permitir filtrar por status, serviço e período |
| RF-017 | C3 | A lista deve paginar (20 itens por página) |
| RF-018 | C4 | O admin deve poder atualizar o status do lead; a mudança deve persistir no banco |
| RF-019 | Geral | Todo o conteúdo deve estar em pt-BR |
| RF-020 | Geral | Textos e imagens das seções devem estar em módulo de conteúdo editável (arquivo tipado) |

---

## 7. Requisitos Não Funcionais

| ID | Categoria | Requisito |
|----|-----------|-----------|
| RNF-001 | Performance | LCP ≤ 2,5s, CLS ≤ 0,1, INP ≤ 200ms no p75 mobile (Core Web Vitals "Good") |
| RNF-002 | Acessibilidade | WCAG 2.1 AA: contraste ≥ 4,5:1 (texto normal), ≥ 3:1 (texto grande/UI); foco visível; navegável por teclado; labels associadas em formulários |
| RNF-003 | Contraste de marca | Texto sobre fundo laranja (#E8862E): usar `--ink #2A2622`; botão com rótulo branco: usar `--brand-primary-deep #C25E1A` (contraste ≥ 4,5:1) |
| RNF-004 | Responsividade | Layout íntegro de 360px a 1440px sem scroll horizontal ou sobreposição |
| RNF-005 | SEO | Metadata API (title, description, OG), HTML semântico (único `<h1>`), `lang="pt-BR"` |
| RNF-006 | LGPD | Formulário com checkbox de consentimento e aviso de finalidade; coletar apenas dados necessários |
| RNF-007 | Segurança | RLS no Supabase: anônimo só INSERT com status `pendente`; autenticado lê e atualiza; sem DELETE exposto; segredos apenas em Server Actions / Route Handlers |
| RNF-008 | Resiliência | Falha no envio de lead não trava a página; fallback de contato exibido |
| RNF-009 | Movimento | Animações respeitam `prefers-reduced-motion: reduce` |
| RNF-010 | Compatibilidade | Duas últimas versões de Chrome, Safari, Firefox, Edge e Safari iOS |
| RNF-011 | Fontes | Fraunces e Inter via `next/font` com `display: swap` e fallback métrico (evita CLS) |
| RNF-012 | Imagens | `next/image` com WebP/AVIF; `priority` apenas na imagem do hero; `alt` descritivo em imagens informativas |

---

## 8. Critérios de Aceite

### CA-01 — Hero
```gherkin
Dado que um usuário acessa a home em dispositivo mobile
Quando a página carrega
Então deve ver, acima da dobra: nome da marca, proposta de valor e CTA "Agendar atendimento"
E a imagem principal não deve causar deslocamento de layout (CLS ≤ 0,1)
```

### CA-02 — Navegação mobile
```gherkin
Dado viewport < 768px
Quando o usuário aciona o botão de menu
Então um drawer deve abrir com links de navegação e CTA primário
E deve ser fechável por toque fora, botão de fechar e tecla Esc
```

### CA-03 — Serviço pré-selecionado
```gherkin
Dado que o usuário vê a seção de serviços
Quando clica em "Agendar" em um card de serviço específico
Então o formulário deve abrir com aquele serviço pré-selecionado no campo "Serviço de interesse"
```

### CA-04 — Formulário: envio válido
```gherkin
Dado que nome, telefone, serviço e consentimento estão preenchidos validamente
Quando o usuário envia o formulário
Então o lead é gravado no banco com status "pendente"
E uma confirmação visual de sucesso é exibida
E o formulário é limpo ou bloqueado para reenvio imediato
```

### CA-05 — Formulário: campo inválido
```gherkin
Dado que um campo obrigatório está vazio ou em formato inválido
Quando o usuário tenta enviar
Então o erro é exibido no campo correspondente
E o lead não é gravado
```

### CA-06 — Formulário: falha de servidor
```gherkin
Dado que o servidor retorna erro ao processar o lead
Quando o usuário envia o formulário
Então uma mensagem de erro é exibida com alternativa de contato (WhatsApp)
E os dados preenchidos são preservados
```

### CA-07 — Boutique sem transação
```gherkin
Dado que o usuário visualiza a seção de boutique
Quando a seção é renderizada
Então não há preço, botão de compra, carrinho ou checkout visível
```

### CA-08 — Proteção do admin
```gherkin
Dado que um usuário não autenticado tenta acessar /admin
Quando faz a requisição
Então é redirecionado para /login
```

### CA-09 — Dashboard
```gherkin
Dado que o admin está autenticado
Quando acessa /admin
Então vê os 4 cards de métricas, o gráfico de área, o de barras e o donut
E os dados refletem o estado atual do banco
```

### CA-10 — Atualização de status
```gherkin
Dado que o admin visualiza um lead em /admin/leads/[id]
Quando altera o status e clica em "Salvar"
Então o status é atualizado no banco
E uma confirmação visual é exibida
```

### CA-11 — Contraste e acessibilidade
```gherkin
Dado qualquer texto sobre fundo colorido da marca
Quando avaliado por ferramenta de contraste
Então a razão é ≥ 4,5:1 para texto normal e ≥ 3:1 para texto grande/UI

Dado um usuário que navega apenas com teclado
Quando percorre a home com Tab
Então todos os elementos interativos são alcançáveis na ordem lógica com foco visível
```

---

## 9. Métricas de sucesso

| Métrica | Meta inicial | Janela |
|---------|-------------|--------|
| CTA primário (cliques / sessões) | ≥ 6% | Primeiras 4 semanas |
| Taxa de conclusão do formulário (envios / iniciados) | ≥ 40% | Primeiras 4 semanas |
| Leads captados por semana | A calibrar no lançamento | Mensal |
| Core Web Vitals "Good" p75 mobile | LCP ≤ 2,5s, CLS ≤ 0,1, INP ≤ 200ms | Contínuo |
| Taxa de erro no formulário (erros servidor / envios) | < 1% | Contínuo |

**Sinais de alerta:** taxa de saída no hero > 70%, abandono de formulário > 70%, reclamações de lentidão.

---

## 10. Dependências e riscos

| ID | Tipo | Item | Impacto | Mitigação |
|----|------|------|---------|-----------|
| D-001 | Dependência | Fotos reais do espaço e dos pets | Alto — sem foto real o luxo não é comunicado | Usar placeholders de qualidade no dev; ensaio fotográfico antes do go-live |
| D-002 | Dependência | Endereço, horários e redes sociais | Médio — footer com placeholders | Stakeholder fornece antes do go-live |
| D-003 | Dependência | Conta Supabase criada e variáveis de ambiente | Bloqueante para Fase 1 | Criar antes da Fase 0 |
| D-004 | Dependência | Logo final / monograma | Necessário para header e OG image | Usar wordmark temporário no dev |
| D-005 | Dependência | Depoimentos reais e autorização de uso de imagem | Médio — seção com placeholder | Stakeholder fornece antes do go-live |
| D-006 | Dependência | Ferramenta de analytics e base legal LGPD | Necessário para RNF-006/007 | Definir antes do go-live |
| R-001 | Risco | Laranja muito saturado em área grande destrói percepção de luxo | Alto | Regra 60/30/10; revisão de design antes de aprovar |
| R-002 | Risco | Texto branco sobre laranja reprovado em acessibilidade | Médio | RNF-003 define regra; validar no dev |
| R-003 | Risco | Conteúdo real (textos, números, depoimentos) não disponível a tempo | Médio | Conteúdo provisório; checklist pré-go-live |

---

## 11. Questões em aberto

| ID | Questão | Bloqueante para |
|----|---------|----------------|
| Q-01 | Dados reais do Trust Bar (anos, nº de pets, avaliação) | Conteúdo da seção A3 |
| Q-02 | Endereço completo, horários, e-mail de contato | Footer, RF-007 |
| Q-03 | Redes sociais (Instagram, TikTok, etc.) e handles | Footer |
| Q-04 | Fotos reais do espaço e dos pets | Galeria, Hero, Cards |
| Q-05 | Depoimentos reais de clientes e autorização de uso | Seção A8 |
| Q-06 | Logo final / monograma | Header, OG image |
| Q-07 | Ferramenta de analytics (Google Analytics, Plausible, etc.) | RNF-007 |
| Q-08 | Base legal LGPD e texto de política de privacidade | Formulário (CA-04), Footer |
| Q-09 | Há data de lançamento ou evento que define prazo? | Planejamento |
| Q-10 | Catálogo de boutique: quais produtos destacar? | Seção A6 |
