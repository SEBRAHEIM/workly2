-- Create Favorite Creators table
create table if not exists favorite_creators (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references profiles(id) on delete cascade not null,
  creator_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Prevent duplicates
  unique(student_id, creator_id)
);

-- Enable RLS
alter table favorite_creators enable row level security;

-- Policies

-- Student can view their own favorites
create policy "Users can view their own favorites"
  on favorite_creators for select
  using (auth.uid() = student_id);

-- Students can insert (favorite) items where they are the student_id
create policy "Users can add favorites"
  on favorite_creators for insert
  with check (auth.uid() = student_id);

-- Students can delete (unfavorite) items where they are the student_id
create policy "Users can remove favorites"
  on favorite_creators for delete
  using (auth.uid() = student_id);
