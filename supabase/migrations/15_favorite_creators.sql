-- Create Favorite Creators table
create table if not exists favorite_creators (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references profiles(id) on delete cascade not null,
  creator_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Prevent duplicates
  unique(client_id, creator_id)
);

-- Enable RLS
alter table favorite_creators enable row level security;

-- Policies

-- Client can view their own favorites
create policy "Users can view their own favorites"
  on favorite_creators for select
  using (auth.uid() = client_id);

-- Clients can insert (favorite) items where they are the client_id
create policy "Users can add favorites"
  on favorite_creators for insert
  with check (auth.uid() = client_id);

-- Clients can delete (unfavorite) items where they are the client_id
create policy "Users can remove favorites"
  on favorite_creators for delete
  using (auth.uid() = client_id);
