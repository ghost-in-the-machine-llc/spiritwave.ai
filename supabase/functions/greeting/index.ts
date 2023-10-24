import { streamCompletion } from '../_lib/openai.ts';
import { CENTER, MISSION, SYNTAX, TRAINING } from '../_prompts/instructions.ts';

async function handler(_req: Request): Promise<Response> {
    const messages = [
        MISSION,
        SYNTAX,
        TRAINING,
        CENTER,
    ];

    return await streamCompletion(messages);
}

Deno.serve(handler);
