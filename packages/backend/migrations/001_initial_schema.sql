-- ==============================================================================
-- Looply Database Schema (Supabase PostgreSQL with Row Level Security)
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Subscriptions Table
create table if not exists public.subscriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id text not null, -- Associated Clerk user ID (e.g. user_2...)
    name text not null,
    plan text,
    plan_details text,
    category text not null default 'General',
    price numeric(10, 2) not null default 0.00,
    currency text not null default 'USD',
    billing text not null default 'Monthly',
    status text not null default 'active' check (status in ('active', 'paused', 'cancelled')),
    payment_method text,
    start_date timestamptz default now(),
    renewal_date timestamptz,
    color text default '#e8def8',
    icon_key text default 'wallet',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Indices for performance
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
create index if not exists idx_subscriptions_renewal_date on public.subscriptions(renewal_date);

-- 3. User Settings Table
create table if not exists public.user_settings (
    user_id text primary key, -- Associated Clerk user ID
    preferred_currency text not null default 'USD',
    monthly_budget numeric(10, 2),
    reminder_days_before integer default 2,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. Enable Row Level Security (RLS)
alter table public.subscriptions enable row level security;
alter table public.user_settings enable row level security;

-- 5. Subscriptions RLS Policies (Clerk Auth Integration)
-- Clerk's JWT template passes the user's Clerk ID in the `sub` claim.
-- auth.jwt() ->> 'sub' matches public.subscriptions.user_id

create policy "Users can view their own subscriptions"
    on public.subscriptions for select
    using (auth.jwt() ->> 'sub' = user_id);

create policy "Users can insert their own subscriptions"
    on public.subscriptions for insert
    with check (auth.jwt() ->> 'sub' = user_id);

create policy "Users can update their own subscriptions"
    on public.subscriptions for update
    using (auth.jwt() ->> 'sub' = user_id);

create policy "Users can delete their own subscriptions"
    on public.subscriptions for delete
    using (auth.jwt() ->> 'sub' = user_id);

-- 6. User Settings RLS Policies
create policy "Users can view their own settings"
    on public.user_settings for select
    using (auth.jwt() ->> 'sub' = user_id);

create policy "Users can upsert their own settings"
    on public.user_settings for all
    using (auth.jwt() ->> 'sub' = user_id)
    with check (auth.jwt() ->> 'sub' = user_id);

-- 7. Trigger to automatically update updated_at on modification
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_subscriptions_updated_at
    before update on public.subscriptions
    for each row
    execute function public.handle_updated_at();

create trigger set_user_settings_updated_at
    before update on public.user_settings
    for each row
    execute function public.handle_updated_at();
