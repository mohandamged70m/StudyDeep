-- Enable pgvector
create extension if not exists vector with schema extensions;

-- ==================== PROFILES ====================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'name', new.email));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==================== NOTEBOOKS ====================
create table if not exists public.notebooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  color text default '#D4891A',
  emoji text default '📓',
  source_count int default 0,
  last_studied timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.notebooks enable row level security;

create policy "Users can view own notebooks"
  on public.notebooks for select using (auth.uid() = user_id);
create policy "Users can create own notebooks"
  on public.notebooks for insert with check (auth.uid() = user_id);
create policy "Users can update own notebooks"
  on public.notebooks for update using (auth.uid() = user_id);
create policy "Users can delete own notebooks"
  on public.notebooks for delete using (auth.uid() = user_id);

-- ==================== SOURCES ====================
create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references public.notebooks(id) on delete cascade,
  type text not null check (type in ('pdf', 'text', 'youtube')),
  title text not null,
  raw_content text,
  metadata jsonb default '{}',
  storage_path text,
  created_at timestamptz default now()
);
alter table public.sources enable row level security;

create policy "Users can view own sources"
  on public.sources for select
  using (exists (select 1 from public.notebooks where id = sources.notebook_id and user_id = auth.uid()));
create policy "Users can create sources"
  on public.sources for insert
  with check (exists (select 1 from public.notebooks where id = sources.notebook_id and user_id = auth.uid()));
create policy "Users can delete own sources"
  on public.sources for delete
  using (exists (select 1 from public.notebooks where id = sources.notebook_id and user_id = auth.uid()));

-- ==================== CHUNKS (with embeddings) ====================
create table if not exists public.chunks (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id) on delete cascade,
  notebook_id uuid not null references public.notebooks(id) on delete cascade,
  content text not null,
  chunk_index int not null,
  embedding vector(768)
);
alter table public.chunks enable row level security;

create policy "Users can view own chunks"
  on public.chunks for select
  using (exists (select 1 from public.notebooks where id = chunks.notebook_id and user_id = auth.uid()));
create policy "Users can insert chunks"
  on public.chunks for insert
  with check (exists (select 1 from public.notebooks where id = chunks.notebook_id and user_id = auth.uid()));
create policy "Users can delete chunks"
  on public.chunks for delete
  using (exists (select 1 from public.notebooks where id = chunks.notebook_id and user_id = auth.uid()));

-- ==================== CHAT MESSAGES ====================
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references public.notebooks(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  citations jsonb default '[]',
  created_at timestamptz default now()
);
alter table public.chat_messages enable row level security;

create policy "Users can view own chat messages"
  on public.chat_messages for select
  using (exists (select 1 from public.notebooks where id = chat_messages.notebook_id and user_id = auth.uid()));
create policy "Users can insert chat messages"
  on public.chat_messages for insert
  with check (exists (select 1 from public.notebooks where id = chat_messages.notebook_id and user_id = auth.uid()));
create policy "Users can delete chat messages"
  on public.chat_messages for delete
  using (exists (select 1 from public.notebooks where id = chat_messages.notebook_id and user_id = auth.uid()));

-- ==================== FLASHCARDS ====================
create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references public.notebooks(id) on delete cascade,
  question text not null,
  answer text not null,
  difficulty text default 'new' check (difficulty in ('new', 'easy', 'hard', 'again')),
  next_review timestamptz default now(),
  review_count int default 0,
  source text,
  created_at timestamptz default now()
);
alter table public.flashcards enable row level security;

create policy "Users can view own flashcards"
  on public.flashcards for select
  using (exists (select 1 from public.notebooks where id = flashcards.notebook_id and user_id = auth.uid()));
create policy "Users can insert flashcards"
  on public.flashcards for insert
  with check (exists (select 1 from public.notebooks where id = flashcards.notebook_id and user_id = auth.uid()));
create policy "Users can update own flashcards"
  on public.flashcards for update
  using (exists (select 1 from public.notebooks where id = flashcards.notebook_id and user_id = auth.uid()));
create policy "Users can delete own flashcards"
  on public.flashcards for delete
  using (exists (select 1 from public.notebooks where id = flashcards.notebook_id and user_id = auth.uid()));

-- ==================== MIND MAPS ====================
create table if not exists public.mind_maps (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references public.notebooks(id) on delete cascade,
  center text not null,
  nodes jsonb not null default '[]',
  edges jsonb not null default '[]',
  created_at timestamptz default now()
);
alter table public.mind_maps enable row level security;

create policy "Users can view own mind maps"
  on public.mind_maps for select
  using (exists (select 1 from public.notebooks where id = mind_maps.notebook_id and user_id = auth.uid()));
create policy "Users can insert mind maps"
  on public.mind_maps for insert
  with check (exists (select 1 from public.notebooks where id = mind_maps.notebook_id and user_id = auth.uid()));
create policy "Users can update own mind maps"
  on public.mind_maps for update
  using (exists (select 1 from public.notebooks where id = mind_maps.notebook_id and user_id = auth.uid()));

-- ==================== SUMMARIES ====================
create table if not exists public.summaries (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references public.notebooks(id) on delete cascade,
  core_concepts text[] default '{}',
  key_terms jsonb default '[]',
  topic_breakdown jsonb default '[]',
  exam_questions text[] default '{}',
  connections text,
  created_at timestamptz default now()
);
alter table public.summaries enable row level security;

create policy "Users can view own summaries"
  on public.summaries for select
  using (exists (select 1 from public.notebooks where id = summaries.notebook_id and user_id = auth.uid()));
create policy "Users can insert summaries"
  on public.summaries for insert
  with check (exists (select 1 from public.notebooks where id = summaries.notebook_id and user_id = auth.uid()));

-- ==================== STUDY PLANS ====================
create table if not exists public.study_plans (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references public.notebooks(id) on delete cascade,
  exam_date date not null,
  hours_per_day numeric(4,1) default 1.0,
  total_days int not null,
  days jsonb not null default '[]',
  created_at timestamptz default now()
);
alter table public.study_plans enable row level security;

create policy "Users can view own study plans"
  on public.study_plans for select
  using (exists (select 1 from public.notebooks where id = study_plans.notebook_id and user_id = auth.uid()));
create policy "Users can insert study plans"
  on public.study_plans for insert
  with check (exists (select 1 from public.notebooks where id = study_plans.notebook_id and user_id = auth.uid()));
create policy "Users can delete own study plans"
  on public.study_plans for delete
  using (exists (select 1 from public.notebooks where id = study_plans.notebook_id and user_id = auth.uid()));

-- ==================== STORAGE ====================
insert into storage.buckets (id, name, public) values ('source-files', 'source-files', false)
on conflict (id) do nothing;

create policy "Users can view own files"
  on storage.objects for select
  using (bucket_id = 'source-files' and auth.role() = 'authenticated');
create policy "Users can upload files"
  on storage.objects for insert
  with check (bucket_id = 'source-files' and auth.role() = 'authenticated');
create policy "Users can delete own files"
  on storage.objects for delete
  using (bucket_id = 'source-files' and auth.role() = 'authenticated');
