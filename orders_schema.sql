-- Create a table for orders
create table orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  product_id uuid references products(id) not null,
  buyer_id uuid references profiles(id) not null,
  seller_id uuid references profiles(id) not null,
  amount numeric not null,
  status text check (status in ('pending', 'paid', 'shipped', 'delivered', 'completed', 'cancelled', 'disputed')) default 'pending',
  escrow_release_date timestamp with time zone,
  
  -- Commission and Stripe fields
  commission_rate numeric default 0.10 check (commission_rate >= 0 and commission_rate <= 1),
  commission_amount numeric default 0,
  platform_fee numeric default 0,
  seller_payout numeric,
  stripe_payment_intent_id text,
  stripe_transfer_id text,
  
  -- Constraint to ensure one active order per product (simplified)
  unique(product_id, buyer_id) 
);

-- RLS for Orders
alter table orders enable row level security;

create policy "Users can view their own orders."
  on orders for select
  using ( auth.uid() = buyer_id or auth.uid() = seller_id );

create policy "Buyers can create orders."
  on orders for insert
  with check ( auth.uid() = buyer_id );

create policy "Users can update their own orders."
  on orders for update
  using ( auth.uid() = buyer_id or auth.uid() = seller_id );
