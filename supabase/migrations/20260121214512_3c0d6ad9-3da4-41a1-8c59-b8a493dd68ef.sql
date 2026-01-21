-- Create wood_inquiries table for storing customer inquiries
CREATE TABLE public.wood_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  wood_item TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New'
);

-- Enable Row Level Security
ALTER TABLE public.wood_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (public form submissions)
CREATE POLICY "Anyone can submit an inquiry"
ON public.wood_inquiries
FOR INSERT
WITH CHECK (true);

-- Create policy to prevent public reads (only you can see via dashboard)
CREATE POLICY "No public read access"
ON public.wood_inquiries
FOR SELECT
USING (false);