-- Run this once if your existing articles table does not yet have News subcategories.

alter table public.articles
  add column if not exists sub_category text;

create index if not exists idx_articles_sub_category
  on public.articles(sub_category);
