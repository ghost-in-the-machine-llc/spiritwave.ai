import { createClient as create } from 'https://esm.sh/@supabase/supabase-js@2';

export function createClient(auth: string) {
    return create(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
            global: {
                headers: { Authorization: auth },
            },
        },
    );
}
