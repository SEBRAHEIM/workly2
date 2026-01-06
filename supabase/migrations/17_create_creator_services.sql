-- Create table for category-specific pricing
create table if not exists creator_services (
    id uuid default gen_random_uuid() primary key,
    creator_id uuid references profiles(id) on delete cascade not null,
    category_slug text not null,
    
    pricing_mode text check (pricing_mode in ('fixed', 'negotiable', 'packages')),
    base_price integer default 0,
    currency text default 'AED',
    
    -- For 'packages' mode
    service_packages jsonb default '{}'::jsonb,
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Ensure one service config per category per creator
    unique(creator_id, category_slug)
);

-- RLS Policies
alter table creator_services enable row level security;

create policy "Services are viewable by everyone"
    on creator_services for select
    using ( true );

create policy "Creators can insert their own services"
    on creator_services for insert
    with check ( auth.uid() = creator_id );

create policy "Creators can update their own services"
    on creator_services for update
    using ( auth.uid() = creator_id );

create policy "Creators can delete their own services"
    on creator_services for delete
    using ( auth.uid() = creator_id );
