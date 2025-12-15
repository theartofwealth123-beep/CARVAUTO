alter table markets
  add column if not exists center_lat numeric(9,6),
  add column if not exists center_lng numeric(9,6);
