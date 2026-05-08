-- Run this SQL in your Supabase SQL Editor to enable visitor analytics.

CREATE TABLE IF NOT EXISTS public.site_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id text NOT NULL,
  page_path text NOT NULL,
  user_agent text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can record site visits" ON public.site_visits;
CREATE POLICY "Anyone can record site visits"
  ON public.site_visits FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view site visits" ON public.site_visits;
CREATE POLICY "Admins can view site visits"
  ON public.site_visits FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'sub_admin')
    )
  );

CREATE INDEX IF NOT EXISTS idx_site_visits_created_at ON public.site_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_visits_page_path ON public.site_visits(page_path);
CREATE INDEX IF NOT EXISTS idx_site_visits_visitor_id ON public.site_visits(visitor_id);

CREATE OR REPLACE FUNCTION public.record_site_visit(
  p_page_path text,
  p_visitor_id text,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.site_visits (page_path, visitor_id, user_agent)
  VALUES (p_page_path, p_visitor_id, p_user_agent);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_visitor_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_role text;
  stats jsonb;
BEGIN
  SELECT role INTO requester_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF requester_role NOT IN ('super_admin', 'admin', 'sub_admin') THEN
    RAISE EXCEPTION 'Not authorized to view visitor stats';
  END IF;

  SELECT jsonb_build_object(
    'totalVisits', (SELECT count(*) FROM public.site_visits),
    'uniqueVisitors', (SELECT count(DISTINCT visitor_id) FROM public.site_visits),
    'todayVisits', (
      SELECT count(*)
      FROM public.site_visits
      WHERE created_at >= date_trunc('day', now())
    ),
    'topPages', COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('path', page_path, 'visits', visits))
        FROM (
          SELECT page_path, count(*) AS visits
          FROM public.site_visits
          GROUP BY page_path
          ORDER BY visits DESC
          LIMIT 5
        ) ranked_pages
      ),
      '[]'::jsonb
    )
  ) INTO stats;

  RETURN stats;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_site_visit(text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_visitor_stats() TO authenticated;
