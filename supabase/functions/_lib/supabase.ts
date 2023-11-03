import type { Database } from '../schema.gen.ts';
import {
    PostgrestSingleResponse,
    SupabaseClient,
} from 'https://esm.sh/@supabase/supabase-js@2/dist/module/index.d.ts';
import { createClient as create } from 'https://esm.sh/@supabase/supabase-js@2';

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

interface Options {
    throwOnNoData: boolean;
}

class NoDataError extends Error {}
const DEFAULT: Options = { throwOnNoData: false };

export function handleResponse<T>(
    { data, error }: PostgrestSingleResponse<T>,
    options: Options = DEFAULT,
): NonNullable<T> {
    if (error) throw error;
    if (options.throwOnNoData && !data) {
        throw new NoDataError();
    }

    return data!;
}
