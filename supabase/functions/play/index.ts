import { streamCompletion } from '../_lib/openai.ts';
import { handleCors } from '../_lib/cors.ts';
import { CENTER, MISSION, SYNTAX, TRAINING } from '../_prompts/instructions.ts';
import { createClient } from '../_lib/supabase.ts';

async function handler(req: Request): Promise<Response> {
    const info = await getStep(req);
    const body = JSON.stringify(info, null, 2);
    return new Response(body, {
        headers: {
            'content-type': 'application/json',
        },
    });
}

Deno.serve(handler);

async function getStep(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId')!;
    console.log('session', sessionId);
    // TODO: handle no sessionId
    const token = req.headers.get('Authorization')!;
    const client = createClient(token);
    console.log(token);

    const { data, error } = await client
        .from('session')
        .select('stepId:step_id')
        .eq('id', sessionId)
        .single();

    if (error) console.log(error);
    if (data) console.log(data);
    const { stepId } = data!;

    let query = client
        .from('step')
        .select();

    query = stepId ? query.eq('prior_id', stepId) : query.is('prior_id', null);

    const { data: d2, error: e2 } = await query;

    if (e2) console.log(e2);
    if (d2) console.log(d2);

    return d2;
}
