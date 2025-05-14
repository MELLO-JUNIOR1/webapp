-- Create profiles table
create table if not exists public.profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  full_name text,
  avatar_url text,
  role text check (role in ('customer', 'worker')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create service requests table
create table if not exists public.service_requests (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  budget numeric not null,
  status text check (status in ('open', 'assigned', 'completed')) default 'open',
  customer_id uuid references auth.users not null,
  worker_id uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reviews table
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  service_request_id uuid references public.service_requests on delete cascade not null,
  reviewer_id uuid references auth.users not null,
  reviewed_id uuid references auth.users not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.service_requests enable row level security;
alter table public.reviews enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = user_id );

-- Service requests policies
create policy "Anyone can view service requests"
  on public.service_requests for select
  using ( true );

create policy "Authenticated users can create requests"
  on public.service_requests for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own requests"
  on public.service_requests for update
  using ( auth.uid() = customer_id or auth.uid() = worker_id );

-- Reviews policies
create policy "Anyone can view reviews"
  on public.reviews for select
  using ( true );

create policy "Users can create reviews for completed requests"
  on public.reviews for insert
  with check (
    auth.uid() in (
      select customer_id from public.service_requests sr
      where sr.id = service_request_id
      and sr.status = 'completed'
      union
      select worker_id from public.service_requests sr
      where sr.id = service_request_id
      and sr.status = 'completed'
    )
  );

-- Functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 