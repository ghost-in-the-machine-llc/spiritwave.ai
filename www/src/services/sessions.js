import { client } from './supabase.js';

export const Status = {
    Created: 'created',
    Active: 'active',
    Done: 'done',
};

// temp for initial mvp feedback:
// either get the oldest open session,
// or create a new one if no open sessions exist
export async function getSession() {
    let { data, error } = await client
        .from('session')
        .select('id')
        .neq('status', Status.Done)
        .order('created_at')
        .limit(1)
        .maybeSingle();

    if (!data) {
        ({ data, error } = await createSession());
    }
    
    return { session: data, error };
}

function createSession() {
    return client
        .from('session')
        .insert({})
        .select('id')
        .single();
}