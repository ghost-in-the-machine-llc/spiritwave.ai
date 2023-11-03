import { handleCors } from '../_lib/cors.ts';
import type { SupabaseClient } from '@supabase/types';
import { Status } from '@http/status';
import { createClient } from '../_lib/supabase.ts';
import { SessionManager } from '../_lib/session.ts';
import { createMessages } from '../_lib/prompt.ts';
import { streamCompletion } from '../_lib/openai.ts';

async function handler(req: Request): Promise<Response> {
    const corsResponse = handleCors(req.method);
    if (corsResponse) return corsResponse;

    try {
        const { url, headers } = req;
        const dbClient = getDbClient(headers);
        const manager = new SessionManager(dbClient);

        const sessionId = getSessionId(url);
        const { healerId, serviceId, stepId } = await manager.getSessionInfo(
            sessionId,
        );

        const [healer, service, step] = await Promise.all([
            manager.getHealer(healerId),
            manager.getService(serviceId),
            manager.getStepAfter(stepId),
        ]);

        const messages = createMessages(healer, service, step);
        return streamCompletion(messages);
    } catch (err) {
        console.log('***Trapped Error ***\n', err);

        return new Response(err.message ?? err.toString(), {
            status: err.status ?? 500,
        });
    }
}

Deno.serve(handler);

class HttpError extends Error {
    #code: number | null;
    #text: string | null;

    constructor(code: number, text: string) {
        super();
        this.#code = code;
        this.#text = text;
    }
}

function getSessionId(url: string): number {
    const { searchParams } = new URL(url);
    const sessionId = searchParams.get('sessionId')!;
    if (!sessionId || Number.isNaN(sessionId)) {
        throw new HttpError(Status.BadRequest, 'No valid sessionId found');
    }
    return Number.parseInt(sessionId);
}

function getDbClient(headers: Headers): SupabaseClient {
    const token = headers.get('Authorization')!;
    return createClient(token);
}
