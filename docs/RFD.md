# RFD — Aurè Pet Atelier
## Request for Discussion — Technical Design Document

**Versão:** 1.0  
**Data:** 2026-06-28  
**Status:** Aguardando revisão antes da implementação  
**Autores:** Solution Architect + Tech Lead  
**Referência:** [PRD.md](./PRD.md)

---

## 1. Resumo técnico

Aplicação Next.js 16 (App Router) monolítica com dois contextos de uso: **vitrine pública** (`/`) e **painel admin** (`/admin`). Persiste dados em Supabase Postgres via Row Level Security. Toda lógica de mutação passa por Server Actions. Gráficos são Client Components que recebem dados já agregados como props — sem fetch próprio. A decisão central é **manter simplicidade**: um único app, um único banco, sem camadas desnecessárias.

---

## 2. Architecture Decision Records (ADRs)

### ADR-001 — Supabase como backend-as-a-service
**Decisão:** Usar Supabase gerenciado (Postgres + Auth + RLS).  
**Alternativas avaliadas:** Banco próprio (Neon/Railway) + Auth.js; PlanetScale + NextAuth.  
**Justificativa:** Supabase entrega auth, banco, RLS e SDK em um pacote; sem overhead de infraestrutura; alinhado ao CLAUDE.md do projeto.  
**Consequências:** Lock-in no Supabase; custo zero na free tier para este volume inicial.

### ADR-002 — Defesa em profundidade no `/admin`
**Decisão:** Três camadas de proteção: (1) `middleware.ts`, (2) `admin/layout.tsx` com `getUser()`, (3) RLS no banco.  
**Justificativa:** Nenhuma camada sozinha é suficiente; middleware pode falhar em edge cases; RLS garante que mesmo um bypass de sessão não expose dados.  
**Consequências:** Redundância intencional; custo mínimo em latência.

### ADR-003 — Agregação no Postgres via RPC
**Decisão:** RPC `get_dashboard_metrics()` retorna JSON com todos os blocos de métricas em um round-trip.  
**Alternativas avaliadas:** Múltiplos `SELECT` em JS; query por query no DAL.  
**Justificativa:** Um único round-trip; sem processamento de agregação em JS; Postgres é mais eficiente para `GROUP BY` e `COUNT`.  
**Consequências:** Lógica de métricas acoplada ao banco; precisa de migração se a lógica mudar.

### ADR-004 — Catálogo de serviços como enum SQL
**Decisão:** `service_type` é enum no Postgres; valores fixos no código TypeScript.  
**Alternativas avaliadas:** Tabela `services` gerenciável pelo admin.  
**Justificativa:** Escopo desta entrega não inclui gestão de catálogo; enum é suficiente para MVP.  
**Consequências:** Adicionar serviço exige nova migração (aceitável nesta fase).

### ADR-005 — Sem notificação automática ao receber lead
**Decisão:** Admin verifica novos leads acessando o painel.  
**Alternativas avaliadas:** Supabase Realtime; webhook para WhatsApp Business API; e-mail via Resend.  
**Justificativa:** Fora do escopo desta entrega; notificação pode ser adicionada sem quebrar a arquitetura atual.

---

## 3. Arquitetura da aplicação

```
Browser
  │
  ├── GET / (público)
  │     └── Next.js Server (RSC)
  │           ├── page.tsx (Server Component — compõe seções)
  │           ├── _components/*.tsx (Client Components: BookingForm, Header mobile)
  │           └── _actions/create-lead.ts (Server Action → Supabase)
  │
  ├── GET /admin/* (protegido)
  │     └── middleware.ts → verifica sessão → redirect /login se não autenticado
  │           └── admin/layout.tsx → getUser() → redirect /login se inválido
  │                 ├── admin/page.tsx (Server Component → DAL → dados → Client Charts)
  │                 ├── admin/leads/page.tsx (Server Component → DAL → tabela)
  │                 └── admin/leads/[id]/page.tsx (Server Component + Server Action)
  │
  └── POST /admin/actions (Server Actions protegidas)
        ├── updateLeadStatus
        └── signOut

Supabase
  ├── Auth (sessão via cookies httpOnly)
  ├── Postgres
  │     ├── public.leads (tabela)
  │     ├── leads_daily_stats (view)
  │     └── get_dashboard_metrics() (RPC)
  └── RLS
        ├── anon: INSERT com status='pendente' apenas
        └── authenticated: SELECT + UPDATE
```

---

## 4. Estrutura de diretórios completa

```
c:\Users\maria\OneDrive\Documentos\Projetotesteclaude\
├── app/
│   ├── (public)/                         # Grupo de rotas públicas
│   │   ├── _actions/
│   │   │   └── create-lead.ts            # Server Action: cria lead
│   │   ├── _components/
│   │   │   ├── site-header.tsx           # Header sticky (Server + Sheet client)
│   │   │   ├── hero.tsx                  # Seção hero
│   │   │   ├── trust-bar.tsx             # Selos de confiança
│   │   │   ├── services-section.tsx      # Cards de serviços
│   │   │   ├── premium-differentials.tsx # Diferenciais premium
│   │   │   ├── boutique-showcase.tsx     # Produtos em destaque
│   │   │   ├── gallery-section.tsx       # Galeria de fotos
│   │   │   ├── testimonials.tsx          # Depoimentos
│   │   │   ├── how-it-works.tsx          # Passo a passo
│   │   │   ├── closing-cta.tsx           # Faixa de fechamento
│   │   │   ├── faq-section.tsx           # FAQ accordion
│   │   │   ├── site-footer.tsx           # Rodapé
│   │   │   └── booking-form.tsx          # Formulário ('use client', RHF + Zod)
│   │   └── page.tsx                      # Home page (Server Component)
│   │
│   ├── login/
│   │   ├── _actions/
│   │   │   └── auth.ts                   # signIn / signOut Server Actions
│   │   ├── _components/
│   │   │   └── login-form.tsx            # ('use client')
│   │   └── page.tsx
│   │
│   ├── admin/
│   │   ├── layout.tsx                    # Valida getUser(); redirect se não auth
│   │   ├── _components/
│   │   │   ├── admin-sidebar.tsx
│   │   │   ├── metrics-cards.tsx         # ('use client', recebe dados via props)
│   │   │   ├── leads-area-chart.tsx      # ('use client', Recharts)
│   │   │   ├── leads-bar-chart.tsx       # ('use client', Recharts)
│   │   │   ├── leads-donut-chart.tsx     # ('use client', Recharts)
│   │   │   └── leads-table.tsx           # ('use client', filtros + paginação)
│   │   ├── _data-access/
│   │   │   ├── get-dashboard-metrics.ts  # RPC get_dashboard_metrics()
│   │   │   ├── get-leads.ts              # Lista paginada com filtros
│   │   │   └── get-lead-by-id.ts        # Detalhe do lead
│   │   ├── page.tsx                      # Dashboard (Server Component)
│   │   └── leads/
│   │       ├── page.tsx                  # Lista de leads (Server Component)
│   │       └── [id]/
│   │           ├── _actions/
│   │           │   └── update-lead-status.ts
│   │           ├── _components/
│   │           │   └── lead-detail.tsx   # ('use client')
│   │           └── page.tsx
│   │
│   ├── layout.tsx                        # Root layout: fontes, providers, metadata
│   ├── globals.css                       # Tokens CSS + Tailwind base
│   └── favicon.ico
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts                     # createServerClient
│   │   └── client.ts                     # createBrowserClient
│   └── content/
│       ├── services.ts                   # Catálogo de serviços (dados editáveis)
│       ├── testimonials.ts               # Depoimentos
│       ├── faq.ts                        # Perguntas frequentes
│       └── boutique.ts                   # Produtos em destaque
│
├── types/
│   └── database.ts                       # Tipos gerados do Supabase (ou manuais)
│
├── middleware.ts                          # Proteção /admin/:path*
├── .env.example
├── .env.local                            # NÃO commitar
├── tailwind.config.ts                    # Tokens de design da marca
├── docs/
│   ├── PRD.md
│   └── RFD.md
└── supabase/
    └── migrations/
        └── 0001_init_leads.sql           # Schema inicial
```

---

## 5. Schema do banco de dados (SQL completo)

```sql
-- ============================================================
-- 0001_init_leads.sql
-- ============================================================

-- Enums
CREATE TYPE lead_status AS ENUM (
  'pendente',
  'confirmado',
  'concluido',
  'cancelado'
);

CREATE TYPE service_type AS ENUM (
  'banho_tosa',
  'spa',
  'hotelaria',
  'day_care',
  'taxi_dog',
  'boutique'
);

-- Trigger function: atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabela principal
CREATE TABLE public.leads (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT        NOT NULL CHECK (length(trim(name)) >= 3),
  phone         TEXT        NOT NULL CHECK (phone ~ '^[0-9]{10,11}$'),
  email         TEXT        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  service       service_type NOT NULL,
  preferred_date DATE,
  message       TEXT        CHECK (length(message) <= 500),
  status        lead_status DEFAULT 'pendente' NOT NULL,
  source        TEXT        DEFAULT 'website',
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger de updated_at
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Índices
CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX leads_status_idx     ON public.leads (status);
CREATE INDEX leads_service_idx    ON public.leads (service);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anônimo só pode inserir; status deve ser 'pendente'
CREATE POLICY "anon_insert_leads"
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (status = 'pendente');

-- Usuário autenticado pode ler todos os leads
CREATE POLICY "auth_select_leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Usuário autenticado pode atualizar todos os leads
CREATE POLICY "auth_update_leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- View: série temporal para o gráfico de área
-- ============================================================
CREATE OR REPLACE VIEW leads_daily_stats
  WITH (security_invoker = true)
AS
SELECT
  DATE(created_at AT TIME ZONE 'America/Sao_Paulo') AS day,
  COUNT(*)                                            AS total
FROM public.leads
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1;

-- ============================================================
-- RPC: métricas consolidadas para o dashboard
-- ============================================================
CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_leads',        (SELECT COUNT(*) FROM leads),
    'leads_today',        (SELECT COUNT(*) FROM leads WHERE DATE(created_at AT TIME ZONE 'America/Sao_Paulo') = CURRENT_DATE),
    'confirmation_rate',  ROUND(
                            (SELECT COUNT(*) FROM leads WHERE status = 'confirmado')::numeric /
                            NULLIF((SELECT COUNT(*) FROM leads), 0) * 100,
                            1
                          ),
    'top_service',        (
                            SELECT service FROM leads
                            GROUP BY service
                            ORDER BY COUNT(*) DESC
                            LIMIT 1
                          ),
    'by_service',         (
                            SELECT json_agg(row_to_json(t))
                            FROM (
                              SELECT service, COUNT(*) AS total
                              FROM leads GROUP BY service ORDER BY total DESC
                            ) t
                          ),
    'by_status',          (
                            SELECT json_agg(row_to_json(t))
                            FROM (
                              SELECT status, COUNT(*) AS total
                              FROM leads GROUP BY status
                            ) t
                          )
  ) INTO result;
  RETURN result;
END;
$$;

-- Permissão para authenticated chamar a RPC
GRANT EXECUTE ON FUNCTION get_dashboard_metrics() TO authenticated;
```

---

## 6. Mapa de rotas

| Rota | Componente | Proteção | Observação |
|------|-----------|----------|-----------|
| `GET /` | Server Component | Pública | Home page completa |
| `GET /login` | Client Component | Pública | Redirect para /admin se já autenticado |
| `POST /login` (Server Action) | `signIn` | Pública | Supabase signInWithPassword |
| `GET /admin` | Server Component | Auth | Dashboard; valida `getUser()` no layout |
| `GET /admin/leads` | Server Component | Auth | Lista com filtros via search params |
| `GET /admin/leads/[id]` | Server Component | Auth | Detalhe do lead |
| `POST` (Server Action) | `createLead` | Pública (anon Supabase) | Formulário home |
| `POST` (Server Action) | `updateLeadStatus` | Auth (verifica sessão na action) | Detalhe do lead |
| `POST` (Server Action) | `signOut` | Auth | Admin sidebar |

---

## 7. Estratégia de autenticação

### Fluxo de login
```
1. Usuário acessa /login e preenche e-mail + senha
2. Client → Server Action signIn
3. signIn chama supabase.auth.signInWithPassword()
4. Supabase retorna session → cookies httpOnly setados via @supabase/ssr
5. Server Action redireciona para /admin
```

### Proteção de /admin (três camadas)
```
Requisição para /admin/*
  │
  ├── Camada 1: middleware.ts
  │     createServerClient(cookies) → supabase.auth.getUser()
  │     Se user === null → NextResponse.redirect('/login')
  │     Se válido → NextResponse.next() (refresh cookies)
  │
  ├── Camada 2: app/admin/layout.tsx (Server Component)
  │     createServerClient(cookies) → supabase.auth.getUser()
  │     Se user === null → redirect('/login')  [second check]
  │     Renderiza layout com sidebar
  │
  └── Camada 3: RLS no Supabase
        Mesmo que sessão seja burlada, policy "auth_select_leads"
        bloqueia SELECT para anon → retorna 0 registros
```

> **Atenção:** Usar sempre `getUser()` (valida JWT no Auth server), nunca `getSession()` para autorização. `getSession()` usa cache local e não valida contra o servidor.

### Logout
```
1. Admin clica em "Sair"
2. Client → Server Action signOut
3. signOut chama supabase.auth.signOut()
4. Cookies limpos
5. Redirect para /login
```

---

## 8. Contratos das Server Actions

### `createLead` — `app/(public)/_actions/create-lead.ts`

```typescript
"use server"

import { z } from "zod"

const CreateLeadSchema = z.object({
  name:           z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  phone:          z.string().regex(/^[0-9]{10,11}$/, "Telefone inválido"),
  email:          z.string().email("E-mail inválido").optional().or(z.literal("")),
  service:        z.enum(["banho_tosa","spa","hotelaria","day_care","taxi_dog","boutique"]),
  preferred_date: z.string().optional(),
  message:        z.string().max(500).optional(),
  consent:        z.literal(true, { errorMap: () => ({ message: "Consentimento obrigatório" }) }),
})

export type CreateLeadInput  = z.infer<typeof CreateLeadSchema>
export type CreateLeadResult = {
  success: boolean
  message?: string
  errors?: Partial<Record<keyof CreateLeadInput, string[]>>
}

export async function createLead(input: CreateLeadInput): Promise<CreateLeadResult>
```

### `updateLeadStatus` — `app/admin/leads/[id]/_actions/update-lead-status.ts`

```typescript
"use server"

import { z } from "zod"

const UpdateLeadStatusSchema = z.object({
  id:     z.string().uuid(),
  status: z.enum(["pendente","confirmado","concluido","cancelado"]),
})

export type UpdateLeadStatusInput  = z.infer<typeof UpdateLeadStatusSchema>
export type UpdateLeadStatusResult = { success: boolean; message?: string }

export async function updateLeadStatus(input: UpdateLeadStatusInput): Promise<UpdateLeadStatusResult>
```

### `signIn` — `app/login/_actions/auth.ts`

```typescript
"use server"

const SignInSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
})

export type SignInResult = { success: boolean; message?: string }
export async function signIn(input: SignInInput): Promise<SignInResult>
export async function signOut(): Promise<void>
```

---

## 9. Contratos do Data Access Layer

### `get-dashboard-metrics.ts`

```typescript
export type DashboardMetrics = {
  total_leads:       number
  leads_today:       number
  confirmation_rate: number        // percentual, ex: 42.5
  top_service:       ServiceType
  by_service: Array<{ service: ServiceType; total: number }>
  by_status:  Array<{ status: LeadStatus;   total: number }>
}

export async function getDashboardMetrics(): Promise<DashboardMetrics>
// Executa RPC get_dashboard_metrics() — 1 round-trip
```

### `get-leads.ts`

```typescript
export type GetLeadsParams = {
  status?:    LeadStatus
  service?:   ServiceType
  date_from?: string    // ISO date
  date_to?:   string    // ISO date
  page?:      number    // default 1
  per_page?:  number    // default 20
}

export type LeadsPage = {
  data:  Lead[]
  total: number
  page:  number
  pages: number
}

export async function getLeads(params: GetLeadsParams): Promise<LeadsPage>
```

### `get-lead-by-id.ts`

```typescript
export async function getLeadById(id: string): Promise<Lead | null>
```

### Tipo base `Lead`

```typescript
export type Lead = {
  id:             string
  name:           string
  phone:          string
  email:          string | null
  service:        ServiceType
  preferred_date: string | null
  message:        string | null
  status:         LeadStatus
  source:         string
  created_at:     string
  updated_at:     string
}

export type LeadStatus  = "pendente" | "confirmado" | "concluido" | "cancelado"
export type ServiceType = "banho_tosa" | "spa" | "hotelaria" | "day_care" | "taxi_dog" | "boutique"
```

---

## 10. Estratégia de gráficos

Todos os gráficos usam **shadcn/ui Chart** (wrapper de Recharts). São Client Components que recebem dados prontos via props — **sem fetch próprio**.

| Gráfico | Tipo | Dados | Componente |
|---------|------|-------|-----------|
| Leads por dia | `AreaChart` | `leads_daily_stats` view | `LeadsAreaChart` |
| Leads por serviço | `BarChart` | `by_service` da RPC | `LeadsBarChart` |
| Leads por status | `RadialBarChart` (donut) | `by_status` da RPC | `LeadsDonutChart` |
| Métricas totais | Cards simples | `total_leads`, `leads_today`, `confirmation_rate`, `top_service` | `MetricsCards` |

**Cores dos status no donut:**
- pendente → `#C9A24B` (brand-accent / dourado)
- confirmado → `#E8862E` (brand-primary / âmbar)
- concluido → `#5C7A5A` (success / verde sálvia)
- cancelado → `#B23B2E` (error / vermelho)

---

## 11. Tokens de design (Tailwind config)

```typescript
// tailwind.config.ts
colors: {
  brand: {
    primary:      "#E8862E",   // Âmbar Aurè — CTAs
    "primary-deep":"#C25E1A",  // Terracota — hover, texto branco sobre laranja
    "primary-soft":"#F6C28B",  // Âmbar suave — fundos sutis
    accent:        "#C9A24B",  // Dourado fosco — detalhes de luxo (parcimonioso)
  },
  bg: {
    base:  "#FFFFFF",
    warm:  "#FBF7F1",  // Seções alternadas
  },
  surface: "#F3ECE3",
  ink: {
    DEFAULT: "#2A2622",  // Texto principal
    muted:   "#6E665E",  // Texto secundário
  },
  line: "#E7DDD0",
  success: "#5C7A5A",
  error:   "#B23B2E",
}
```

**Regra de contraste obrigatória:**
- Texto sobre `#E8862E` → usar `ink (#2A2622)` — NUNCA texto branco (contraste 2.4:1, reprovado)
- Botão com rótulo branco → fundo `#C25E1A` (contraste ≈ 4.6:1 ✓)
- Fundos de destaque com laranja → usar `brand-primary-soft (#F6C28B)` com texto `ink`

---

## 12. Plano de implementação em fases

### Pré-requisitos antes de qualquer fase
- [ ] Conta Supabase criada e projeto configurado
- [ ] Variáveis de ambiente disponíveis (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- [ ] Admin provisionado manualmente no Supabase Auth

---

### Fase 0 — Setup e configuração base
**Pré-requisito:** conta Supabase com variáveis disponíveis.

- [ ] Instalar dependências: `@supabase/supabase-js @supabase/ssr`
- [ ] Instalar/configurar shadcn/ui (`npx shadcn@latest init`)
- [ ] Adicionar componentes shadcn: Button, Card, Input, Select, Textarea, Checkbox, Form, Sheet, NavigationMenu, Accordion, Dialog, Sonner, Chart, Table, Badge, Separator
- [ ] Instalar: `recharts date-fns sonner`
- [ ] Configurar `tailwind.config.ts` com tokens de design (seção 11)
- [ ] Configurar `next/font` com Fraunces + Inter em `app/layout.tsx`
- [ ] Criar `lib/supabase/server.ts` e `lib/supabase/client.ts`
- [ ] Criar `.env.example` e `.env.local`
- [ ] Adicionar scripts ao `package.json`: `"type-check": "tsc --noEmit"`, `"lint": "next lint"`
- [ ] Criar `app/globals.css` com variáveis CSS dos tokens

---

### Fase 1a — Schema do banco de dados
**Pré-requisito:** Fase 0 concluída.

- [ ] Criar `supabase/migrations/0001_init_leads.sql` com o SQL da seção 5
- [ ] Executar migration no Supabase
- [ ] Validar RLS: tentar SELECT como anon → deve retornar vazio
- [ ] Validar INSERT anon com status != 'pendente' → deve falhar
- [ ] Criar `types/database.ts` com os tipos manuais (ou gerar via Supabase CLI)

---

### Fase 1b — Home page (vitrine)
**Pré-requisito:** Fase 0 concluída.

- [ ] Criar `lib/content/` com arquivos de conteúdo tipados (services, testimonials, faq, boutique)
- [ ] Criar `app/(public)/page.tsx` como Server Component
- [ ] Implementar seções em ordem: Header, Hero, TrustBar, Services, Differentials, Boutique, Gallery, Testimonials, HowItWorks, ClosingCTA, FAQ, Footer
- [ ] Configurar metadata (title, description, OG)
- [ ] Validar responsividade em 360px, 768px, 1280px
- [ ] Validar contraste de todos os textos sobre fundo colorido

---

### Fase 1c — Formulário de agendamento
**Pré-requisito:** Fase 1a + 1b concluídas.

- [ ] Criar `app/(public)/_actions/create-lead.ts` com Zod + Supabase insert
- [ ] Criar `app/(public)/_components/booking-form.tsx` ('use client', RHF)
- [ ] Integrar formulário na home (modal ou seção)
- [ ] Testar fluxo completo: preenchimento → validação → envio → confirmação
- [ ] Testar falha de servidor: confirmar toast de erro + dados preservados
- [ ] Testar pré-seleção de serviço vindo dos cards

**Deploy opcional:** Fases 0–1c podem ir a produção antes do admin.

---

### Fase 2a — Autenticação admin
**Pré-requisito:** Fase 1 concluída, admin provisionado no Supabase.

- [ ] Criar `middleware.ts` com matcher `/admin/:path*` e `getUser()`
- [ ] Criar `app/login/page.tsx` + `_components/login-form.tsx` + `_actions/auth.ts`
- [ ] Criar `app/admin/layout.tsx` com `getUser()` + redirect
- [ ] Criar `app/admin/_components/admin-sidebar.tsx` com botão de logout
- [ ] Testar: acesso a /admin sem auth → redirect /login
- [ ] Testar: login → /admin; logout → /login

---

### Fase 2b — Dashboard admin
**Pré-requisito:** Fase 2a concluída.

- [ ] Criar `app/admin/_data-access/get-dashboard-metrics.ts` (chama RPC)
- [ ] Criar `app/admin/page.tsx` (Server Component que busca dados e passa como props)
- [ ] Criar `_components/metrics-cards.tsx` (Client Component)
- [ ] Criar `_components/leads-area-chart.tsx` (Client Component, AreaChart)
- [ ] Criar `_components/leads-bar-chart.tsx` (Client Component, BarChart)
- [ ] Criar `_components/leads-donut-chart.tsx` (Client Component, RadialBarChart)
- [ ] Validar que os gráficos renderizam com dados reais do banco

---

### Fase 2c — Lista e detalhe de leads
**Pré-requisito:** Fase 2a concluída.

- [ ] Criar `app/admin/_data-access/get-leads.ts` com paginação + filtros
- [ ] Criar `app/admin/leads/page.tsx` com filtros via search params
- [ ] Criar `app/admin/_data-access/get-lead-by-id.ts`
- [ ] Criar `app/admin/leads/[id]/page.tsx`
- [ ] Criar `_actions/update-lead-status.ts`
- [ ] Criar `_components/lead-detail.tsx` ('use client', seletor de status)
- [ ] Testar atualização de status end-to-end

---

## 13. Checklist técnico pré-fase-0

Validar antes de escrever qualquer linha de código de feature:

- [ ] `@supabase/ssr` versão atual: verificar doc oficial para padrão correto de cookies (`getAll/setAll` — não `get/set/remove` individuais que estão deprecated)
- [ ] Compatibilidade `@supabase/ssr` com Next.js 16 (App Router) confirmada
- [ ] Conta Supabase criada e URL + anon key disponíveis
- [ ] Admin criado manualmente no Supabase Dashboard → Authentication → Users
- [ ] `npx shadcn@latest init` compatível com TailwindCSS 4 (verificar versão atual do shadcn/ui)
- [ ] Entender se `globals.css` do projeto precisa ser refatorado para variáveis CSS (TailwindCSS 4 usa variáveis CSS nativamente, não `tailwind.config.ts` para tokens)
- [ ] Verificar se a versão do Zod instalada (4.x no projeto) tem mudanças de API relevantes

---

## 14. Hipóteses e pontos de atenção

### Hipóteses assumidas (confirmar antes da implementação)
- **H1** — Admins são provisionados manualmente no Supabase; sem signup público na app
- **H2** — Todo usuário autenticado tem acesso pleno ao admin (sem papéis distintos)
- **H3** — "Detalhes do cliente" = detalhes do lead (sem tabela `customers` separada)
- **H4** — Sem notificação automática ao receber lead (WhatsApp Business API, e-mail, etc.)
- **H5** — Catálogo de serviços fixo no código; não gerenciável pelo admin nesta entrega
- **H6** — Região Supabase: `sa-east-1` (São Paulo) para LGPD e latência

### Pontos de atenção técnicos
- **TailwindCSS 4:** a configuração de tokens pode ser via variáveis CSS em `globals.css` em vez de `tailwind.config.ts` — verificar a abordagem correta para esta versão
- **`@supabase/ssr`:** os padrões de cookie mudaram; consultar documentação atual antes de implementar auth
- **Texto branco sobre laranja:** validar contraste com ferramenta antes de aprovar design final
- **`prefers-reduced-motion`:** todas as animações devem ter fallback

### Dados ainda não fornecidos (placeholders necessários)
- Endereço do pet shop
- E-mail de contato
- Horários de funcionamento
- Redes sociais e handles
- Fotos reais
- Logo final
- Depoimentos reais
- Números do Trust Bar (anos de experiência, pets atendidos)
