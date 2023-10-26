const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
        'authorization, x-client-info, apikey, content-type',
};

export function handleCors(method: string): Response | null {
    if (method !== 'OPTIONS') return null;
    return new Response('ok', { headers: corsHeaders });
}
