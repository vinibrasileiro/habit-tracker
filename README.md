# Desafio 30 Dias — Bullet Journal Habit Tracker

Tracker de hábitos estilo bullet journal para o desafio de 30 dias entre Vinicius e Camila. Next.js (App Router) + Tailwind + Supabase (Postgres + Realtime), hospedado na Vercel.

## Setup

### 1. Criar o projeto no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No SQL Editor do projeto, rode os arquivos de `supabase/migrations/` **em ordem**:
   - `0001_init.sql` — tabelas (`people`, `habits`, `checkins`, `settings`).
   - `0002_seed_people_habits.sql` — dados fixos (Vinicius/Camila + hábitos) e a linha inicial de `settings` (começa hoje, 30 dias).
   - `0003_policies.sql` — RLS aberta (app sem login) e realtime habilitado em `checkins`.
3. Em Project Settings → API, copie a **Project URL** e a **anon public key**.

### 2. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os valores do passo anterior.

### 3. Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Mudar a data de início de um novo desafio

Não existe tela de configuração (app de 2 pessoas, uso pouco frequente). Rode no SQL Editor do Supabase:

```sql
update settings
set challenge_start_date = '2026-11-01', challenge_duration_days = 30
where id = 1;
```

## Deploy

1. Suba o repositório no GitHub.
2. Importe o projeto na [Vercel](https://vercel.com/new).
3. Configure as mesmas duas variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) em Project Settings → Environment Variables.
4. Deploy. O link pode ser compartilhado direto com Vinicius e Camila — não há login, só a escolha de perfil na primeira visita (guardada no `localStorage` de cada aparelho).
