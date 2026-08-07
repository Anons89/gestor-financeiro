# Algent — gestor financeiro

App de controle de gastos com IA: a pessoa escreve "gastei 15 no uber", a IA lê, categoriza e mostra pra onde o dinheiro vai. Assinatura de £2,99/mês com 30 dias grátis.

**Site:** https://algent.co.uk

## Stack

| Peça | O que faz |
|------|-----------|
| **Netlify** | Hospeda as páginas e roda as funções serverless (`netlify/functions/`) |
| **Supabase** | Login (email/senha + Google) e banco de dados (gastos, configurações, assinaturas) |
| **Stripe** | Cobrança da assinatura (checkout, webhook, cancelamento) |
| **NVIDIA API** | IA que categoriza os gastos e responde como coach (`meta/llama-3.1-8b-instruct`) |

## Estrutura

```
index.html     → landing page
app.html       → o app inteiro (uma página só)
privacy.html   → política de privacidade
terms.html     → termos de uso
netlify.toml   → headers de segurança
netlify/functions/
  categorize.js          → IA que lê o gasto (só pra assinante)
  coach.js               → coach financeiro (só pra assinante)
  create-checkout.js     → abre o pagamento do Stripe (só logado)
  cancel-subscription.js → cancela a assinatura (só logado)
  stripe-webhook.js      → escuta os avisos do Stripe e atualiza o banco
  lib/verify-user.js     → ajudante que confere token + assinatura (não é endpoint)
```

## Variáveis de ambiente (cofre do Netlify)

Configurar em **Site settings → Environment variables**. Nunca commitar esses valores.

| Nome | O que é |
|------|---------|
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe (`sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Segredo do webhook do Stripe (`whsec_...`) |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE` | Chave service_role do Supabase (a "chave-mestra") |
| `NVIDIA_API_KEY` | Chave da API da NVIDIA |

## Banco de dados (Supabase)

Três tabelas. **Todas precisam de RLS (Row Level Security) ligado** para cada pessoa só enxergar as próprias linhas.

```sql
-- GASTOS: cada linha pertence a quem criou
create table if not exists expenses (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date timestamptz not null default now(),
  cur text,
  amount numeric,
  category text,
  description text
);
alter table expenses enable row level security;
create policy "own rows" on expenses
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- CONFIGURAÇÕES: uma ficha por pessoa
create table if not exists settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb,
  updated_at timestamptz default now()
);
alter table settings enable row level security;
create policy "own rows" on settings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ASSINATURAS: escrita SÓ pelo servidor (service_role); a pessoa só lê a própria
-- IMPORTANTE: user_id PRECISA ser primary key (ou unique) — o webhook faz upsert;
-- sem isso, cada aviso do Stripe cria uma linha nova e o app quebra.
create table if not exists subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text,
  stripe_customer_id text,
  current_period_end timestamptz,
  updated_at timestamptz default now()
);
alter table subscriptions enable row level security;
create policy "read own" on subscriptions for select using (user_id = auth.uid());
-- (sem policy de insert/update para usuários: só o service_role escreve aqui)
```

> ✅ **Confira no seu Supabase** que as tabelas/policies estão assim — em especial o
> `primary key` em `subscriptions.user_id` e o `default auth.uid()` em `expenses.user_id`.

## Segurança — decisões tomadas

- As funções de IA (`categorize`, `coach`) **exigem token de assinante** — sem isso qualquer pessoa poderia usar a chave da NVIDIA de graça.
- `create-checkout` descobre quem é a pessoa **pelo token**, nunca pelo que o navegador diz; a URL de retorno é fixa no servidor.
- O webhook do Stripe confere a assinatura HMAC **e** rejeita avisos com mais de 5 minutos (anti-replay).
- O `supabase-js` é carregado com **versão travada + integrity (SRI)** — se o CDN for adulterado, o navegador recusa.
- `netlify.toml` define CSP e demais headers de segurança.
- No logout, **tudo** que é pessoal sai do aparelho (gastos, fixos, conversa do coach, categorias aprendidas).

## Rodando local

```bash
npx netlify dev
```

(as funções precisam das variáveis de ambiente; use `netlify env:pull` ou um `.env` local — que não deve ser commitado)
