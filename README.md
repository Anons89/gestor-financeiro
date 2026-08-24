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
index.html     → landing page          index.js → sessão + entrada ao rolar
app.html       → o app inteiro          app.js  → toda a lógica do app
privacy.html   → política de privacidade ┐
terms.html     → termos de uso          ┘ legal.js → troca de idioma (compartilhado)
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
  -- marcada pra cancelar no fim do período. O Stripe mantém status "active"
  -- até o período acabar, então sem esta coluna o app diria "assinatura ativa"
  -- pra quem acabou de cancelar.
  cancel_at_period_end boolean default false,
  updated_at timestamptz default now()
);
-- Se a sua tabela já existia, rode só esta linha:
alter table subscriptions add column if not exists cancel_at_period_end boolean default false;
alter table subscriptions enable row level security;
create policy "read own" on subscriptions for select using (user_id = auth.uid());
-- (sem policy de insert/update para usuários: só o service_role escreve aqui)
```

> ✅ **Confira no seu Supabase** que as tabelas/policies estão assim — em especial o
> `primary key` em `subscriptions.user_id` e o `default auth.uid()` em `expenses.user_id`.

### Cota diária de IA (recomendado — rode este SQL)

Sem isto o app já tem um freio de rajada (na memória do servidor), que segura o
abuso óbvio. Este SQL liga o **teto diário**, que segura o abuso lento e distribuído.
Enquanto não for rodado, a cota diária simplesmente não trava ninguém — o app
continua funcionando normalmente.

```sql
-- Contador de uso da IA por pessoa/por dia. Só o servidor mexe aqui.
create table if not exists ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket  text not null,                    -- "categorize", "coach", "checkout"...
  day     date not null default current_date,
  count   int  not null default 0,
  primary key (user_id, bucket, day)
);
alter table ai_usage enable row level security;
-- (sem policy nenhuma: ninguém logado lê nem escreve; só o service_role passa)

-- Soma +1 e devolve TRUE se ainda cabe no teto. Tudo numa tacada só, pra duas
-- chamadas ao mesmo tempo não furarem a cota.
create or replace function bump_ai_usage(p_user uuid, p_bucket text, p_limit int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare novo int;
begin
  insert into ai_usage (user_id, bucket, day, count)
  values (p_user, p_bucket, current_date, 1)
  on conflict (user_id, bucket, day)
    do update set count = ai_usage.count + 1
  returning count into novo;
  return novo <= p_limit;
end;
$$;

revoke all on function bump_ai_usage(uuid, text, int) from public, anon, authenticated;
```

Limpeza opcional (a tabela cresce 1 linha por pessoa/tipo/dia):

```sql
delete from ai_usage where day < current_date - interval '30 days';
```

### Emails automáticos (rode este SQL antes de usar os emails)

As três funções de email (`send-welcome-email`, `send-activation-email`,
`send-weekly-summary`) guardam aqui o que já mandaram, pra não repetir. **Sem
esta tabela, as funções não enviam nada** (por segurança preferem calar-se a
arriscar spam) — então rode isto uma vez no Supabase:

```sql
create table if not exists email_log (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  email_type text not null,                       -- "welcome" | "activation" | "weekly"
  sent_at    timestamptz not null default now()
);
create index if not exists email_log_lookup on email_log (user_id, email_type, sent_at desc);
alter table email_log enable row level security;
-- (sem policy nenhuma: só o service_role escreve/lê; o app nunca toca aqui)
```

Variáveis de ambiente no Netlify (além das do Stripe/Supabase que já existem):

- `RESEND_API_KEY` — chave do Resend.
- `EMAIL_FROM` *(opcional)* — remetente. Default `Algent <hello@algent.co.uk>`.
  Se esse endereço não estiver verificado no Resend, ponha um que esteja
  (ex.: `Algent <noreply@algent.co.uk>`) — sem mexer em código.

## Segurança — decisões tomadas

- As funções de IA (`categorize`, `coach`) **exigem token de assinante** — sem isso qualquer pessoa poderia usar a chave da NVIDIA de graça.
- **Freio de uso** em toda função que custa dinheiro (`lib/rate-limit.js`): rajada na memória do servidor + cota diária no Supabase. Impede que uma conta de £2,99 queime a fatura da NVIDIA num laço.
- O texto da pessoa vai pra IA como **mensagem separada** (`role: user`), nunca colado nas instruções — um "ignore as regras acima" digitado por ela é lido como dado.
- **Nada do que a IA devolve entra sem conferência**: valor tem que ser número finito, categoria tem que estar na lista, descrição é cortada.
- `create-checkout` descobre quem é a pessoa **pelo token**, nunca pelo que o navegador diz; a URL de retorno é fixa no servidor; e **recusa quem já tem assinatura viva** (evita cobrança dupla).
- O webhook do Stripe confere a assinatura HMAC, rejeita avisos com mais de 5 minutos (anti-replay) **e descarta avisos atrasados** que chegariam fora de ordem (o Stripe não garante a ordem — sem isso um "ativo" antigo poderia ressuscitar uma assinatura cancelada).
- **Erro interno nunca vai pro navegador** — vai pro log do Netlify.
- O `supabase-js` é carregado com **versão travada + integrity (SRI)** — se o CDN for adulterado, o navegador recusa.
- `netlify.toml` define HSTS, CSP e demais headers de segurança.
- No logout, **tudo** que é pessoal sai do aparelho (gastos, fixos, conversa do coach, categorias aprendidas).

- **CSP sem `'unsafe-inline'` em `script-src`.** Todo o JS mora em arquivos (`app.js`, `index.js`, `legal.js`) e não existe nenhum `onclick="..."` no HTML — os botões criados na hora carregam só um rótulo `data-act`, e um ouvinte único em `app.js` decide o que fazer. Efeito prático: **mesmo que um texto malicioso chegue à tela, o navegador se recusa a executá-lo.**

### O que ainda está em aberto (consciente)

- **`'unsafe-inline'` em `style-src`.** Os estilos ficam no `<style>` de cada página. Risco bem menor: CSS não executa código.
- **Login e recuperação de senha** rodam direto no Supabase Auth (SDK no navegador), então o rate limiting deles é o do próprio Supabase — o app não tem como pôr freio antes. Confira os limites em *Authentication → Rate Limits* no painel.

## Testes de segurança

```bash
node --test tests/
```

Não precisa instalar nada (usa o runner que já vem no Node 18+). Cobrem: assinatura
do webhook do Stripe (adulteração, impostor, replay, rodízio de segredo), o freio de
uso, e as funções de IA recusando quem não está logado ou não é assinante — além da
conferência do que a IA devolve.

## Rodando local

```bash
npx netlify dev
```

(as funções precisam das variáveis de ambiente; use `netlify env:pull` ou um `.env` local — que não deve ser commitado)
