import { decodeJWTPayload } from '@supabase/gotrue-helpers';

// const encoder = new TextEncoder();
// const secret = Deno.env.get('JWT_SECRET');
// const keyBuffer = encoder.encode(secret);

// const keyPromise = crypto.subtle.importKey(
//     'raw',
//     keyBuffer,
//     { name: 'HMAC', hash: 'SHA-256' },
//     true,
//     ['sign', 'verify'],
// );

export function getUserPayload(token: string) {
    return decodeJWTPayload(token);
}
