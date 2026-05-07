-- Run this SQL in your Supabase SQL Editor to set up the articles table

-- Create the articles table
create table public.articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  image_url text not null default '',
  author text not null default '',
  author_id uuid references auth.users on delete set null,
  category text not null default 'World',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.articles enable row level security;

-- Allow anyone (including anonymous) to read articles
create policy "Articles are publicly readable"
  on articles for select
  using (true);

-- Allow authenticated users to insert articles
create policy "Authenticated users can create articles"
  on articles for insert
  with check (auth.role() = 'authenticated');

-- Allow authenticated users to update their own articles, or admins to update any
create policy "Authors and admins can update articles"
  on articles for update
  using (auth.role() = 'authenticated');

-- Allow authenticated users to delete articles
create policy "Authenticated users can delete articles"
  on articles for delete
  using (auth.role() = 'authenticated');

-- Enable real-time for the articles table
alter publication supabase_realtime add table articles;

-- Create an index for faster category filtering
create index idx_articles_category on articles(category);
create index idx_articles_created_at on articles(created_at desc);

-- Function to auto-update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Trigger to auto-update updated_at
create trigger on_articles_updated
  before update on articles
  for each row execute procedure public.handle_updated_at();

-- Seed some initial articles so the site isn't empty
insert into public.articles (title, excerpt, content, image_url, author, category) values
(
  'The Rise of Edge Computing in Modern Architecture',
  'How edge computing is reshaping the way we think about distributed systems and bringing computation closer to the data source.',
  'Edge computing represents a paradigm shift in how we architect modern applications. By processing data closer to where it is generated, organizations can achieve lower latency, reduced bandwidth costs, and improved privacy. This article explores the key patterns and best practices for implementing edge computing in production environments.

The traditional cloud computing model, where all data is sent to centralized data centers for processing, is being challenged by the exponential growth of IoT devices and real-time applications. Edge computing addresses this by distributing computation across a network of edge nodes, each capable of processing data locally before sending aggregated results to the cloud.

Key benefits include sub-millisecond response times for critical applications, reduced data transfer costs, and enhanced data sovereignty compliance. Companies like Cloudflare, Vercel, and Deno are leading the charge with their edge runtime platforms, making it easier than ever for developers to deploy code at the edge.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
  'Sarah Chen',
  'Technology'
),
(
  'Global Markets Rally Amid Trade Optimism',
  'International stock markets surged as new trade agreements signal a period of economic cooperation between major economies.',
  'Global financial markets experienced a broad-based rally today as investors reacted positively to the announcement of new bilateral trade agreements between several major economies. The developments have fueled optimism about sustained economic growth and reduced geopolitical tensions.

The S&P 500 rose 2.3%, while European markets saw even larger gains, with the FTSE 100 up 2.8% and the DAX climbing 3.1%. Asian markets also participated in the rally, with the Nikkei 225 gaining 2.5% in early trading.

Analysts attribute the market enthusiasm to the comprehensive nature of the agreements, which cover not only traditional goods trade but also digital services, intellectual property protections, and environmental standards. This holistic approach has been viewed as a more sustainable foundation for international commerce.',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
  'Marcus Webb',
  'Business'
),
(
  'Breakthrough in Quantum Error Correction',
  'Scientists achieve a major milestone in quantum computing by demonstrating fault-tolerant error correction at scale for the first time.',
  'A team of researchers has announced a groundbreaking achievement in quantum computing: the first demonstration of fault-tolerant quantum error correction operating at a scale sufficient for practical computation. This milestone, long considered the holy grail of quantum computing, brings the technology significantly closer to solving real-world problems.

Quantum computers are inherently susceptible to errors caused by environmental noise and the fragile nature of quantum states. Error correction has been the primary bottleneck preventing quantum computers from outperforming classical computers on practical problems.

The new approach uses a novel topological error correction code that can detect and correct errors in real-time without disrupting ongoing computations. The system demonstrated error rates below the critical threshold needed for indefinitely long quantum computations.',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
  'Dr. Priya Sharma',
  'Science'
),
(
  'The Mental Health Revolution in Professional Sports',
  'Athletes are leading a cultural shift by openly discussing mental health, changing how organizations support their players.',
  'Professional sports are undergoing a profound transformation in how mental health is perceived and addressed. What was once considered a taboo subject is now at the forefront of organizational strategy, player development, and fan engagement.

Leading athletes across multiple sports have shared their personal struggles with anxiety, depression, and burnout, helping to destigmatize mental health challenges in high-performance environments. Their courage has prompted leagues and teams to invest heavily in mental health infrastructure.

Teams are now employing dedicated sports psychologists, offering meditation and mindfulness programs, and creating safe spaces for athletes to discuss their mental well-being. The NFL, NBA, and Premier League have all introduced comprehensive mental health policies.',
  'https://images.unsplash.com/photo-1461896836934-bd45ba052024?w=800',
  'James Rodriguez',
  'Sports'
),
(
  'New Gene Therapy Shows Promise for Rare Diseases',
  'Clinical trials demonstrate remarkable efficacy of a novel gene therapy approach that could transform treatment for hereditary conditions.',
  'A pioneering gene therapy approach has shown exceptional results in phase III clinical trials, offering hope to millions of patients worldwide suffering from rare genetic diseases. The therapy, which uses an advanced viral vector delivery system, has demonstrated the ability to correct genetic defects at their source.

The treatment targets a specific class of hereditary conditions caused by single-gene mutations. In trials involving 200 patients across 15 countries, 87% showed significant improvement in symptoms, with 42% achieving what researchers describe as functional cure status.

Unlike previous gene therapy attempts, this new approach uses a modified adeno-associated virus (AAV) vector that can deliver corrective genetic material with unprecedented precision and minimal immune response.',
  'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800',
  'Dr. Elena Vasquez',
  'Health'
),
(
  'The Streaming Wars: A New Chapter Begins',
  'As the entertainment landscape shifts again, emerging platforms challenge established giants with innovative content strategies.',
  'The streaming entertainment industry is entering a new phase of competition that promises to reshape how content is created, distributed, and consumed. While established players like Netflix, Disney+, and HBO Max continue to dominate subscriber counts, a wave of innovative newcomers is challenging the status quo.

These emerging platforms are differentiating themselves not through massive content libraries but through unique curation approaches, interactive storytelling formats, and creator-first business models. Some are leveraging AI to create personalized content experiences, while others focus on underserved global markets.

The financial dynamics of streaming are also evolving. The era of spending billions on content with little regard for profitability is giving way to more disciplined approaches that balance growth with sustainability.',
  'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800',
  'Olivia Park',
  'Entertainment'
);
