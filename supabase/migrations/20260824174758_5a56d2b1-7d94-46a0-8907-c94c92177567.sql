CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  request_type TEXT NOT NULL DEFAULT 'estimate',
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  instagram TEXT,
  preferred_contact TEXT NOT NULL DEFAULT 'email',
  notes TEXT,
  garment TEXT,
  quantity INTEGER,
  placements TEXT[],
  personalised_count INTEGER,
  artwork_status TEXT,
  estimate_low NUMERIC(10,2),
  estimate_high NUMERIC(10,2),
  spec_summary TEXT
);

GRANT INSERT ON public.quote_requests TO anon;
GRANT INSERT ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a quote request"
  ON public.quote_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);