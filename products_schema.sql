-- Create a table for products
create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  seller_id uuid references profiles(id) not null,
  title text not null,
  description text,
  price numeric not null check (price >= 0),
  currency text default 'USD',
  images text[] default '{}', -- Array of image URLs
  category text,
  condition text check (condition in ('new', 'like_new', 'good', 'fair', 'poor')) default 'new',
  status text check (status in ('active', 'sold', 'archived')) default 'active',
  
  constraint title_length check (char_length(title) >= 3)
);

-- RLS for Products
alter table products enable row level security;

create policy "Products are viewable by everyone."
  on products for select
  using ( true );

create policy "Sellers can insert their own products."
  on products for insert
  with check ( auth.uid() = seller_id );

create policy "Sellers can update their own products."
  on products for update
  using ( auth.uid() = seller_id );

create policy "Sellers can delete their own products."
  on products for delete
  using ( auth.uid() = seller_id );
