import { streamCompletion } from '../_lib/openai.ts';
import { INVOCATION, MISSION, SYNTAX } from '../_prompts/instructions.ts';

async function handler(_req: Request): Promise<Response> {
    const messages = [
        MISSION,
        SYNTAX,
        INVOCATION,
    ];

    return await streamCompletion(messages);
}

Deno.serve(handler);
