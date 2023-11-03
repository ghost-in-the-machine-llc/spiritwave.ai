import { client } from './supabase.js';

export let token = null;
watchAuth((_event, session) => {
    token = session?.access_token ?? null;
});

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
