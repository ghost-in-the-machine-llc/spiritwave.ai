import type { Database } from '../schema.gen.ts';
import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/types';
import { createClient as create } from '@supabase';

export function createClient(
    Authorization: string,
): SupabaseClient {
    return create<Database>(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
            global: {
                headers: { Authorization },
            },
        },
    );
}

export function handleResponse<T>(
    { data, error }: PostgrestSingleResponse<T>,
): NonNullable<T> {
    if (error) throw error;
    return data!;
}
