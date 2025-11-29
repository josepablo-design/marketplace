-- Create a table for conversations
create table conversations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  product_id uuid references products(id) not null,
  buyer_id uuid references profiles(id) not null,
  seller_id uuid references profiles(id) not null,
  
  -- Ensure unique conversation per product between same buyer and seller
  unique(product_id, buyer_id, seller_id)
);

-- Create a table for messages
create table messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id uuid references profiles(id) not null,
  content text not null,
  is_read boolean default false
);

-- RLS for Conversations
alter table conversations enable row level security;

create policy "Users can view their own conversations."
  on conversations for select
  using ( auth.uid() = buyer_id or auth.uid() = seller_id );

create policy "Users can create conversations."
  on conversations for insert
  with check ( auth.uid() = buyer_id );

-- RLS for Messages
alter table messages enable row level security;

create policy "Users can view messages in their conversations."
  on messages for select
  using ( exists (
    select 1 from conversations
    where conversations.id = messages.conversation_id
    and (conversations.buyer_id = auth.uid() or conversations.seller_id = auth.uid())
  ));

create policy "Users can send messages to their conversations."
  on messages for insert
  with check ( exists (
    select 1 from conversations
    where conversations.id = messages.conversation_id
    and (conversations.buyer_id = auth.uid() or conversations.seller_id = auth.uid())
  ));
