import { Status, STATUS_TEXT } from 'http/status';
import { corsHeaders, handleCors } from '../_lib/cors.ts';
import { HealingSessionManager } from '../_lib/HealingSessionManager.ts';
import { createMessages, createMessagesFrom } from '../_lib/prompt.ts';
import { Message, streamCompletion } from '../_lib/openai.ts';
import { HttpError } from '../_lib/http.ts';
import { getAllContent } from '../_lib/streams.ts';
import { Step } from '../database.types.ts';

async function handler(req: Request): Promise<Response> {
    const corsResponse = handleCors(req.method);
    if (corsResponse) return corsResponse;

    try {
        const url = new URL(req.url);
        const sessionId = getSessionId(url);
        const userToken = getUserToken(req.headers);

        const manager = new HealingSessionManager(userToken, sessionId);
        const sessionInfo = await manager.getOpenSessionInfo();
        if (!sessionInfo) return getNoSessionResponse();
        if (sessionInfo.status === 'done') {
            return getSessionDoneResponse(sessionId);
        }
        const priorStepId = sessionInfo.step_id;

        console.log({ priorStepId });

        let priorMessages: Message[], step: Step;
        try {
            [priorMessages, step] = await Promise.all([
                manager.getPriorMessages(priorStepId),
                manager.getStepAfter(priorStepId),
            ]);
        } catch (err) {
            console.error(err);
            throw err;
        }

        return new Response(JSON.stringify({ step, priorMessages }), {
            headers: {
                'content-type': 'application/json',
            },
        });
    } catch (err) {
        const { message } = err;
        console.error(err);

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

async function getPromptMessages(
    manager: HealingSessionManager,
    priorMessages: Message[],
    step: Step,
): Promise<Message[]> {
    if (priorMessages.length) return createMessagesFrom(priorMessages, step);

    const { healer, service } = await manager.getFullSessionInfo();
    return createMessages(healer, service, step);
}

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

function getSessionDoneResponse(sessionId: number): Response {
    // const body = {
    //     message: 'Healing Session Complete',
    //     complete: true,
    //     sessionId,
    // };

    return new Response(null, {
        headers: {
            ...corsHeaders,
        },
        status: Status.NoContent,
    });
}

function getNoSessionResponse(): Response {
    return new Response(JSON.stringify({ message: 'No open session found' }), {
        headers: {
            ...corsHeaders,
        },
        status: Status.BadRequest,
    });
}
