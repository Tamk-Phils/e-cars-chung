-- =========================================================================
-- DEALERSHIP PLATFORM SQL SCHEMA & SEED DATA (BANK REPOSSESSED VEHICLES FLEET)
-- Total Active Units: 600 Authentic Bank Repossessed Vehicles
-- Source: https://bankrepossessedautos.com/vehicles
-- =========================================================================

-- 1. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  condition TEXT NOT NULL DEFAULT 'Bank Seized / Repo',
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  sale_price NUMERIC(12, 2),
  down_payment NUMERIC(12, 2),
  mileage TEXT,
  transmission TEXT,
  exterior_color TEXT,
  interior_color TEXT,
  fuel_type TEXT,
  body_type TEXT,
  engine TEXT,
  drivetrain TEXT,
  vin TEXT,
  title_status TEXT,
  trim TEXT,
  description TEXT,
  features TEXT[],
  images TEXT[],
  is_hot_deal BOOLEAN DEFAULT FALSE,
  is_sold BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alter columns to TEXT in case table was previously created with restrictive VARCHAR:
ALTER TABLE IF EXISTS public.vehicles 
  ALTER COLUMN make TYPE TEXT,
  ALTER COLUMN model TYPE TEXT,
  ALTER COLUMN condition TYPE TEXT,
  ALTER COLUMN mileage TYPE TEXT,
  ALTER COLUMN transmission TYPE TEXT,
  ALTER COLUMN exterior_color TYPE TEXT,
  ALTER COLUMN interior_color TYPE TEXT,
  ALTER COLUMN fuel_type TYPE TEXT,
  ALTER COLUMN body_type TYPE TEXT,
  ALTER COLUMN drivetrain TYPE TEXT,
  ALTER COLUMN title_status TYPE TEXT,
  ALTER COLUMN trim TYPE TEXT,
  ALTER COLUMN vin TYPE TEXT;

-- Remove any old listings completely
DELETE FROM public.vehicles;

-- 2. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT DEFAULT 'News',
  keywords TEXT[],
  author TEXT DEFAULT 'KJ Autos',
  read_minutes INTEGER DEFAULT 5,
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  body TEXT NOT NULL,
  vehicle_bought TEXT,
  date TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  type TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  delivery_option TEXT NOT NULL,
  has_trade_in BOOLEAN DEFAULT FALSE,
  trade_in_details TEXT,
  notes TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  customer_city TEXT,
  customer_state TEXT,
  customer_zip TEXT,
  vehicle_id TEXT,
  vehicle_name TEXT NOT NULL,
  vehicle_slug TEXT NOT NULL,
  vehicle_price NUMERIC(12, 2) NOT NULL,
  vehicle_image TEXT,
  vehicle_condition TEXT,
  vehicle_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on vehicles') THEN
    CREATE POLICY 'Allow public read access on vehicles' ON public.vehicles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on posts') THEN
    CREATE POLICY 'Allow public read access on posts' ON public.posts FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on reviews') THEN
    CREATE POLICY 'Allow public read access on reviews' ON public.reviews FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on orders') THEN
    CREATE POLICY 'Allow public read access on orders' ON public.orders FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on orders') THEN
    CREATE POLICY 'Allow public insert on orders' ON public.orders FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on reviews') THEN
    CREATE POLICY 'Allow public insert on reviews' ON public.reviews FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- =========================================================================
-- SEED DATA: 600 AUTHENTIC BANK REPOSSESSED VEHICLES
-- =========================================================================
