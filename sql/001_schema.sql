create extension if not exists "uuid-ossp";

create table if not exists markets (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  state text,
  radius_miles int default 75,
  created_at timestamptz default now()
);

create table if not exists listings (
  id uuid primary key default uuid_generate_v4(),

  market_id uuid references markets(id),

  source text not null,
  source_listing_id text,
  listing_url text not null unique,

  title text,
  description text,
  posted_at timestamptz,
  scraped_at timestamptz default now(),

  price int,
  location_text text,

  year int,
  make text,
  model text,
  trim text,
  mileage int,

  title_status text not null default 'UNKNOWN', -- CLEAN | RISK | UNKNOWN
  clean_title_required boolean not null default true,

  vin_masked text,
  vin_hash text,
  vin_source text, -- DESCRIPTION | IMAGE | USER | UNKNOWN

  plate_detected boolean not null default false,
  vin_label_detected boolean not null default false,
  vin_text_detected boolean not null default false,

  cve_trade int,
  cve_wholesale_mid int,
  target_buy_private int,
  target_buy_wholesale int,
  expected_spread int,
  deal_score int,
  confidence int,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_listings_market on listings(market_id);
create index if not exists idx_listings_year_make_model on listings(year, make, model);
create index if not exists idx_listings_price on listings(price);
create index if not exists idx_listings_mileage on listings(mileage);
create index if not exists idx_listings_deal_score on listings(deal_score);
create index if not exists idx_listings_title_status on listings(title_status);

create table if not exists listing_flags (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  flag_type text not null,
  confidence numeric(3,2) not null,
  evidence text,
  created_at timestamptz default now()
);

create index if not exists idx_flags_listing on listing_flags(listing_id);
create index if not exists idx_flags_type on listing_flags(flag_type);

create table if not exists listing_images (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  image_url text not null,
  created_at timestamptz default now()
);

create table if not exists outcomes (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references listings(id) on delete set null,
  offered_price int,
  accepted_price int,
  outcome text, -- WON | LOST | NO_RESPONSE | INVALID
  reason text,
  created_at timestamptz default now()
);

-- Optional: trigger to auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_listings_updated_at on listings;
create trigger trg_listings_updated_at
before update on listings
for each row execute procedure set_updated_at();
