import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_PROJECT_URL = 'http://localhost:54321';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const client = createClient(SUPABASE_PROJECT_URL, SUPABASE_API_KEY);

export function watchAuth(callback) {
    client.auth.onAuthStateChange(callback);
}

export async function signUp(credentials){
    return await client.auth.signUp(credentials);
}

export async function signIn(credentials){
    return await client.auth.signInWithPassword(credentials);
}

export async function signOut(){
    return await client.auth.signOut();
}
