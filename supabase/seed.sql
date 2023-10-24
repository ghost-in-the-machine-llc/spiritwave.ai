-- Table: public.waitlist

-- case insensitive column type
CREATE EXTENSION IF NOT EXISTS citext;  

DROP TABLE IF EXISTS public.waitlist;
CREATE TABLE IF NOT EXISTS public.waitlist
(
    id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    created_at timestamp with time zone NOT NULL DEFAULT now(),    
    email citext NOT NULL,
    CONSTRAINT waitlist_pk PRIMARY KEY(id),
    CONSTRAINT email_unique UNIQUE(email)
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.waitlist
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.waitlist TO anon;
GRANT ALL ON TABLE public.waitlist TO authenticated;
GRANT ALL ON TABLE public.waitlist TO postgres;
GRANT ALL ON TABLE public.waitlist TO service_role;
GRANT ALL ON TABLE public.waitlist TO supabase_admin;

DROP POLICY IF EXISTS "Enable insert for public" ON public.waitlist;
CREATE POLICY "Enable insert for public" ON public.waitlist
    AS PERMISSIVE FOR INSERT 
    TO public
    WITH CHECK (true);