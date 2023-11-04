import { Status, STATUS_TEXT } from 'http/status';
import { corsHeaders, handleCors } from '../_lib/cors.ts';
import { HealingSessionManager } from '../_lib/HealingSessionManager.ts';
import { createMessages } from '../_lib/prompt.ts';
import { streamCompletion } from '../_lib/openai.ts';
import { HttpError } from '../_lib/http.ts';
import { getAllContent } from '../_lib/streams.ts';

async function handler(req: Request): Promise<Response> {
    const corsResponse = handleCors(req.method);
    if (corsResponse) return corsResponse;

    try {
        const url = new URL(req.url);
        const sessionId = getSessionId(url);
        const userToken = getUserToken(req.headers);

        const manager = new HealingSessionManager(userToken, sessionId);
        const { healer, service, step_id } = await manager.getSession();

        const step = await manager.getStepAfter(step_id);
        if (!step) {
            // done, no more steps...
            // update status in healing session
            // TODO: how should we signal this to the requestor?
            return new Response('done', {
                headers: {
                    ...corsHeaders,
                },
                status: 200, // there is probably some code for this
            });
        }

        const messages = createMessages(healer, service, step);
        const { status, stream } = await streamCompletion(messages);
        const [response, save] = stream.tee();

        // We are going to start responding with the stream
        // and don't want to block just to do post-message clean-up.
        // By not "awaiting" and using events, we allow code execution
        // to move thru these lines and get to the response...
        manager.updateSessionStep(sessionId, step.id);
        save
            .pipeTo(getAllContent((response) => {
                console.log({ sessionId, messages, response });
            }));

        return new Response(response.pipeThrough(new TextEncoderStream()), {
            headers: {
                ...corsHeaders,
                'content-type': 'text/event-stream; charset=utf-8',
                'x-content-type-options': 'nosniff',
            },
            status: status,
        });
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

        console.log(err);

        return new Response(message ?? err.toString(), {
            status: Status.InternalServerError,
            statusText: STATUS_TEXT[Status.InternalServerError],
        });
    }
}

Deno.serve(handler);

function getUserToken(headers: Headers): string {
    const auth = headers.get('Authorization')!;
    return auth.replace(/^Bearer /, '');
}

function getSessionId(url: URL): number {
    const { searchParams } = url;
    const sessionId = searchParams.get('sessionId')!;
    if (!sessionId || Number.isNaN(sessionId)) {
        throw new HttpError(
            Status.BadRequest,
            'Healing sessionId not included in the request',
        );
    }
    return Number.parseInt(sessionId);
}

// return new Response(JSON.stringify({ healer, service, step_id }), {
//     headers: {
//         'content-type': 'application/json',
//     },
// });
