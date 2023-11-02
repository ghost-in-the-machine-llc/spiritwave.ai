import { client } from './supabase.js';

export function createSession() {
    return client
        .from('session')
        .insert({})
        .select('id')
        .single();
}
