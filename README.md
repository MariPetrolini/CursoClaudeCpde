# Aurè Pet Atelier

Aplicação web completa para pet shop de luxo, desenvolvida com **Next.js 16 App Router** e **Supabase**. Inclui home page pública com captura de leads, painel administrativo com dashboard analítico e gestão de agendamentos.

## Tecnologias

| Tecnologia | Versão | Descrição |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | Framework React com App Router |
| [React](https://react.dev) | 19 | Biblioteca de UI |
| [TypeScript](https://www.typescriptlang.org) | 5 | Tipagem estática |
| [TailwindCSS](https://tailwindcss.com) | 4 | Design tokens via `@theme` em globals.css |
| [shadcn/ui](https://ui.shadcn.com) | 4 | Componentes (base: `@base-ui/react`) |
| [Supabase](https://supabase.com) | — | Auth, Postgres e Row Level Security |
| [React Hook Form](https://react-hook-form.com) | 7 | Formulários |
| [Zod](https://zod.dev) | 4 | Validação de schemas |
| [Recharts](https://recharts.org) | 3 | Gráficos do dashboard |
| [date-fns](https://date-fns.org) | 4 | Datas em pt-BR |
| [Sonner](https://sonner.emilkowal.ski) | 2 | Toast notifications |
| [Jest](https://jestjs.io) + [RTL](https://testing-library.com) | 30 | Testes unitários |

## Estrutura do projeto

```
/
├── app/
│   ├── (public)/             # Home page pública
│   │   ├── page.tsx          # Orquestra 12 seções + BookingModal
│   │   ├── _components/      # Hero, Serviços, FAQ, Footer, etc.
│   │   └── _actions/         # createLead (Server Action)
│   ├── admin/                # Painel administrativo (auth protegido)
│   │   ├── page.tsx          # Dashboard com métricas + gráficos
│   │   ├── layout.tsx        # Valida sessão, renderiza sidebar
│   │   ├── _components/      # MetricsCards, AreaChart, BarChart, DonutChart
│   │   ├── _data-access/     # getDashboardMetrics, getLeadsDailyStats
│   │   └── leads/
│   │       ├── page.tsx      # Lista de leads com filtros e paginação
│   │       ├── _components/  # LeadsFilters, LeadsTable, LeadsPagination
│   │       ├── _actions/     # updateLeadStatus (Server Action)
│   │       └── [id]/         # Detalhe do lead com atualização de status
│   ├── login/                # Autenticação admin
│   │   ├── page.tsx
│   │   ├── _components/      # LoginForm
│   │   └── _actions/         # signIn, signOut
│   ├── layout.tsx            # Root layout (fontes, metadata)
│   └── globals.css           # Design tokens @theme (paleta Aurè)
├── components/ui/            # Primitivos shadcn/ui
├── lib/
│   ├── supabase/             # createClient server + browser
│   └── content/             # Dados estáticos (services, FAQ, etc.)
├── types/database.ts         # Tipos, enums e label maps
├── supabase/migrations/      # 0001_init_leads.sql (schema + RLS + RPC)
├── __tests__/                # 183 testes unitários
├── proxy.ts                  # Auth guard (Next.js 16 — não middleware.ts)
└── .env.example
```

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Preencha com URL e chaves do seu projeto Supabase

# 3. Aplicar schema do banco
# Cole o conteúdo de supabase/migrations/0001_init_leads.sql
# no SQL Editor do painel Supabase e execute.

# 4. Servidor de desenvolvimento (http://localhost:3000)
npm run dev

# Build de produção
npm run build
```

## Scripts disponíveis

```bash
npm run dev           # Servidor local (porta 3000)
npm run build         # Build de produção
npm run type-check    # TypeScript sem emissão (tsc --noEmit)
npm run lint          # ESLint
npm run test          # Jest (todos os testes)
npm run test:coverage # Jest com relatório de cobertura
```

## Cobertura de testes

| Métrica | Resultado |
|---|---|
| Statements | ≥ 97% |
| Branches | ≥ 89% |
| Functions | ≥ 80% |
| Lines | ≥ 97% |

Testes localizados em `__tests__/` cobrindo: Server Actions, Data Access Layer, componentes React, páginas e utilitários.

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase (pública) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon do Supabase (pública) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key — somente servidor |

> **Nunca** commite `.env.local`. O `.gitignore` já o exclui.

## Arquitetura de autenticação

O acesso ao `/admin` é protegido em 3 camadas:
1. **`proxy.ts`** (Edge) — redireciona para `/login` se não autenticado
2. **`app/admin/layout.tsx`** (Server) — valida `getUser()` antes de renderizar
3. **RLS no Supabase** — anônimos só podem `INSERT` em `leads`, nunca `SELECT/UPDATE`

## Autora

**Mariana Manzato Petrolini** — [@MariPetrolini](https://github.com/MariPetrolini)
