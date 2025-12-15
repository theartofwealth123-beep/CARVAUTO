alter table listings
  add column if not exists seller_type text not null default 'UNKNOWN'; -- PRIVATE | DEALER | UNKNOWN

create index if not exists idx_listings_seller_type on listings(seller_type);
