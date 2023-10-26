import { streamCompletion } from '../_lib/openai.ts';
import { handleCors } from '../_lib/cors.ts';
import { INVOCATION, MISSION, SYNTAX } from '../_prompts/instructions.ts';

async function handler(req: Request): Promise<Response> {
    const messages = [
        MISSION,
        SYNTAX,
        INVOCATION,
    ];

    const cors = handleCors(req.method);
    if (cors) return cors;

    return await streamCompletion(messages);
}

Deno.serve(handler);
