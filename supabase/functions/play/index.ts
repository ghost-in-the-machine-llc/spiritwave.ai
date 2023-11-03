import { Status, STATUS_TEXT } from 'http/status';
import { handleCors } from '../_lib/cors.ts';
import { createClient } from '../_lib/supabase.ts';
import { SessionManager } from '../_lib/session.ts';
import { createMessages } from '../_lib/prompt.ts';
import { streamCompletion } from '../_lib/openai.ts';
import { HttpError } from '../_lib/http.ts';

async function handler(req: Request): Promise<Response> {
    const corsResponse = handleCors(req.method);
    if (corsResponse) return corsResponse;

    try {
        const { url, headers } = req;
        const auth = headers.get('Authorization')!;
        const dbClient = createClient(auth);
        const manager = new SessionManager(dbClient);

        const sessionId = getSessionId(url);

        const { healer, service, step_id } = await manager.getSession(
            sessionId,
        );
        const step = await manager.getStepAfter(step_id);
        if (!step) {
            // all done!
            // TODO: how should we signal this?
            return new Response();
        } else {
            // no "awaiting", code execution for this function continues...
            // manager.updateSessionStep(sessionId, step.id);
        }

        const messages = createMessages(healer, service, step);
        return streamCompletion(messages);
    } catch (err) {
        const { message } = err;

        if (err.code === 'PGRST116') {
            throw new HttpError(
                Status.NotFound,
                'The provided id does not exist or you do not have access',
            );
        }

        if (err instanceof HttpError) {
            return new Response(JSON.stringify({ message }), {
                status: err.statusCode,
                statusText: err.statusText,
            });
        }

        return new Response(message ?? err.toString(), {
            status: Status.InternalServerError,
            statusText: STATUS_TEXT[Status.InternalServerError],
        });
    }
}

Deno.serve(handler);

function getSessionId(url: string): number {
    const { searchParams } = new URL(url);
    const sessionId = searchParams.get('sessionId')!;
    if (!sessionId || Number.isNaN(sessionId)) {
        throw new HttpError(
            Status.BadRequest,
            'sessionId not included in the request',
        );
    }
    return Number.parseInt(sessionId);
}
