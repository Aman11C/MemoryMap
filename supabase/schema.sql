-- ==============================================================================
-- MEMORYMAP SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- 1. PROFILES TABLE (Linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. MEMORIES TABLE
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  date date not null default current_date,
  location_name text,
  latitude double precision,
  longitude double precision,
  activity text,
  mood text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PHOTOS TABLE
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid references public.memories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  image_url text not null,
  original_filename text,
  captured_at timestamp with time zone,
  latitude double precision,
  longitude double precision,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PEOPLE TABLE
create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. MEMORY_PEOPLE JUNCTION TABLE
create table if not exists public.memory_people (
  memory_id uuid not null references public.memories(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,
  primary key (memory_id, person_id)
);

-- 6. STORIES TABLE
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.memories enable row level security;
alter table public.photos enable row level security;
alter table public.people enable row level security;
alter table public.memory_people enable row level security;
alter table public.stories enable row level security;

-- PROFILES Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- MEMORIES Policies
create policy "Users can read own memories"
  on public.memories for select
  using (auth.uid() = user_id);

create policy "Users can create own memories"
  on public.memories for insert
  with check (auth.uid() = user_id);

create policy "Users can update own memories"
  on public.memories for update
  using (auth.uid() = user_id);

create policy "Users can delete own memories"
  on public.memories for delete
  using (auth.uid() = user_id);

-- PHOTOS Policies
create policy "Users can view own photos"
  on public.photos for select
  using (auth.uid() = user_id);

create policy "Users can insert own photos"
  on public.photos for insert
  with check (auth.uid() = user_id);

create policy "Users can update own photos"
  on public.photos for update
  using (auth.uid() = user_id);

create policy "Users can delete own photos"
  on public.photos for delete
  using (auth.uid() = user_id);

-- PEOPLE Policies
create policy "Users can view own people"
  on public.people for select
  using (auth.uid() = user_id);

create policy "Users can insert own people"
  on public.people for insert
  with check (auth.uid() = user_id);

create policy "Users can update own people"
  on public.people for update
  using (auth.uid() = user_id);

create policy "Users can delete own people"
  on public.people for delete
  using (auth.uid() = user_id);

-- MEMORY_PEOPLE Policies
create policy "Users can view own memory_people links"
  on public.memory_people for select
  using (
    exists (
      select 1 from public.memories
      where memories.id = memory_people.memory_id
      and memories.user_id = auth.uid()
    )
  );

create policy "Users can insert own memory_people links"
  on public.memory_people for insert
  with check (
    exists (
      select 1 from public.memories
      where memories.id = memory_people.memory_id
      and memories.user_id = auth.uid()
    )
  );

create policy "Users can delete own memory_people links"
  on public.memory_people for delete
  using (
    exists (
      select 1 from public.memories
      where memories.id = memory_people.memory_id
      and memories.user_id = auth.uid()
    )
  );

-- STORIES Policies
create policy "Users can view own stories"
  on public.stories for select
  using (auth.uid() = user_id);

create policy "Users can create own stories"
  on public.stories for insert
  with check (auth.uid() = user_id);

create policy "Users can update own stories"
  on public.stories for update
  using (auth.uid() = user_id);

create policy "Users can delete own stories"
  on public.stories for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- STORAGE BUCKET & STORAGE POLICIES
-- ==============================================================================

-- Create storage bucket for memory photos
insert into storage.buckets (id, name, public)
values ('memory-photos', 'memory-photos', false)
on conflict (id) do nothing;

-- Storage RLS: Users can only access their own user-scoped directory in 'memory-photos'
create policy "Users can view own memory photos in storage"
  on storage.objects for select
  using (
    bucket_id = 'memory-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can upload own memory photos to storage"
  on storage.objects for insert
  with check (
    bucket_id = 'memory-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own memory photos in storage"
  on storage.objects for update
  using (
    bucket_id = 'memory-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own memory photos in storage"
  on storage.objects for delete
  using (
    bucket_id = 'memory-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
