import type { Database } from '../schema.gen.ts';
import type {
    AuthError,
    PostgrestError,
    SupabaseClient,
} from '@supabase/types';
import { createClient as createSb } from '@supabase';

const URL = Deno.env.get('SUPABASE_URL') ?? '';
// const API_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ??
    '';
// const SERVICE_AUTH_HEADER = `Bearer ${SERVICE_ROLE_KEY}`;

export function createClient(
    token: string,
): SupabaseClient {
    return createSb<Database>(
        URL,
        token,
        {
            auth: {
                persistSession: false,
            },
            global: {
                headers: { Authorization: `Bearer ${token}` },
            },
        },
    );
}

export function createServiceClient(): SupabaseClient {
    return createSb<Database>(
        URL,
        SERVICE_ROLE_KEY,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
        },
    );
}

interface DataOrErrorResponse<T> {
    data: T | null;
    error: PostgrestError | AuthError | null;
}

export function handleResponse<T>(
    { data, error }: DataOrErrorResponse<T>,
): NonNullable<T> {
    if (error) throw error;
    return data as NonNullable<T>;
}
