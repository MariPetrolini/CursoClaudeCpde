# CursoClaudeCode

Projeto base desenvolvido durante o **Curso Claude Code** — um template moderno para aplicações web com Next.js, seguindo boas práticas de arquitetura e organização de código.

## Tecnologias

| Tecnologia | Versão | Descrição |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | Framework React com App Router |
| [React](https://react.dev) | 19 | Biblioteca de UI |
| [TypeScript](https://www.typescriptlang.org) | 5 | Tipagem estática |
| [TailwindCSS](https://tailwindcss.com) | 4 | Estilização utilitária |
| [React Hook Form](https://react-hook-form.com) | 7 | Gerenciamento de formulários |
| [Zod](https://zod.dev) | 4 | Validação de schemas |

## Arquitetura

O projeto segue a estrutura do **App Router** do Next.js com separação clara de responsabilidades:

```
/
├── app/                  # Rotas (App Router)
│   ├── layout.tsx        # Layout raiz
│   ├── page.tsx          # Página inicial
│   └── globals.css       # Estilos globais
├── components/           # Componentes reutilizáveis
│   └── ui/              # Primitivos de UI (shadcn)
├── actions/              # Server Actions
├── lib/                  # Helpers e configurações
└── types/                # Tipos globais e schemas Zod
```

### Padrão por página

Cada rota segue o padrão:

```
app/nome-da-pagina/
├── page.tsx              # Server Component (ponto de entrada)
├── _components/          # Componentes da página
├── _actions/             # Server Actions
└── _data-access/         # Data Access Layer
```

## Como rodar

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento (http://localhost:3000)
npm run dev

# Build de produção
npm run build

# Iniciar em produção
npm start
```

## Boas práticas adotadas

- **Server Components por padrão** — `use client` apenas quando necessário (hooks, eventos, browser APIs)
- **Server Actions** para mutações — nunca chamar banco diretamente em Client Components
- **Zod** para validação de dados no servidor
- **TypeScript estrito** — sem `any`, usar `unknown` + type guards
- **Tailwind only** — sem CSS inline ou styled-components
- Formulários com **React Hook Form + Zod**

## Variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus valores:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_*` — valores seguros expostos ao cliente
- Segredos (DB, API keys) — apenas em Server Actions ou Route Handlers
