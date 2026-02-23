-- Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  username text UNIQUE,
  role text CHECK (role IN ('client', 'creator')),
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- RLS Policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Add Creator Reputation fields to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS specializations text[], -- Array of category slugs
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS level integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS rating_avg numeric(3, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_projects integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS wallet_balance numeric(10, 2) DEFAULT 0.00;

-- Projects Table (Negotiation)
CREATE TABLE IF NOT EXISTS projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id uuid REFERENCES profiles(id) NOT NULL,
    creator_id uuid REFERENCES profiles(id) NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    file_url text, -- URL to Supabase Storage
    status text NOT NULL CHECK (status IN ('requested', 'negotiating', 'agreed', 'in_progress', 'submitted', 'completed', 'cancelled')) DEFAULT 'requested',
    current_price numeric(10, 2), -- The currently active/agreed price
    funds_status text CHECK (funds_status IN ('pending', 'escrow', 'released', 'refunded')) DEFAULT 'pending',
    payment_intent_id text,
    due_date timestamptz,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Offers Table (Negotiation Loop)
CREATE TABLE IF NOT EXISTS offers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    sender_id uuid REFERENCES profiles(id) NOT NULL,
    price numeric(10, 2) NOT NULL,
    status text NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reviews Table (Reputation)
CREATE TABLE IF NOT EXISTS reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES projects(id) NOT NULL,
    client_id uuid REFERENCES profiles(id) NOT NULL,
    creator_id uuid REFERENCES profiles(id) NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Portfolio Items Table (Reputation)
CREATE TABLE IF NOT EXISTS portfolio_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id uuid REFERENCES profiles(id) NOT NULL,
    category_slug text NOT NULL, -- Mandatory link to category
    title text NOT NULL,
    image_url text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for New Tables

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
CREATE POLICY "Users can view their own projects" ON projects
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = creator_id);

DROP POLICY IF EXISTS "Clients can insert projects" ON projects;
CREATE POLICY "Clients can insert projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = creator_id);

-- Offers
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view offers for their projects" ON offers;
CREATE POLICY "Users can view offers for their projects" ON offers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = offers.project_id 
            AND (projects.client_id = auth.uid() OR projects.creator_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can insert offers for their projects" ON offers;
CREATE POLICY "Users can insert offers for their projects" ON offers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = offers.project_id 
            AND (projects.client_id = auth.uid() OR projects.creator_id = auth.uid())
        )
    );

-- Portfolio
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Portfolio items are public" ON portfolio_items;
CREATE POLICY "Portfolio items are public" ON portfolio_items
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Creators can manage their portfolio" ON portfolio_items;
CREATE POLICY "Creators can manage their portfolio" ON portfolio_items
    FOR ALL USING (auth.uid() = creator_id);

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews are public" ON reviews;
CREATE POLICY "Reviews are public" ON reviews
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Clients can write reviews for their completed projects" ON reviews;
CREATE POLICY "Clients can write reviews for their completed projects" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = client_id);
