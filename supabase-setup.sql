-- Run this SQL in your Supabase SQL Editor to set up the roles system

-- Create a table for public profiles with roles
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text not null,
  role text not null check (role in ('super_admin', 'admin', 'sub_admin')) default 'sub_admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by users."
  on profiles for select
  using ( auth.role() = 'authenticated' );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Only super admins can update roles (we handle this via simple check in the policy, but for now we'll allow updates and rely on the app logic, or strictly:)
create policy "Super admins can manage all profiles"
  on profiles for all
  using ( 
    (select role from profiles where id = auth.uid()) = 'super_admin' 
  );

-- Function to handle new user creation
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id, 
    new.email, 
    -- The first user created becomes the super_admin, others become sub_admin
    case 
      when not exists (select 1 from public.profiles) then 'super_admin'
      else 'sub_admin'
    end
  );
  return new;
end;
$$;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
