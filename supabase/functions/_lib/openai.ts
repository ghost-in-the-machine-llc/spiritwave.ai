import { LogStdOutStream, OpenAIContentStream } from './streams.ts';

const API_KEY = Deno.env.get('OPENAI_API_KEY');
const COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';

export async function streamCompletion(
    messages: { role: string; content: string }[],
): Promise<Response> {
    // body is a ReadableStream when opt { stream: true }
    const res = await fetch(
        COMPLETIONS_URL,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages,
                temperature: 1.0, // TODO: what is good default?
                // temperature: 2.0, // TODO: change at different times?
                stream: true, // makes response streaming
            }),
        },
    );

    const { ok, status, body } = res;

    if (!ok) {
        const text = await res.text();
        console.log('open AI call failed', text);
        return new Response(text, {
            headers: {
                'content-type': 'application/json',
            },
            status: status,
        });
    }

    console.log('openAI call succeeded');

    const stream = (
        body
            ?.pipeThrough(new TextDecoderStream())
            .pipeThrough(new OpenAIContentStream())
            // use to peek at streamed output via server console
            .pipeThrough(new LogStdOutStream())
            .pipeThrough(new TextEncoderStream())
    ) ?? null;

    return new Response(stream, {
        headers: {
            'content-type': 'text/event-stream; charset=utf-8',
            // 'x-content-type-options': 'nosniff',
        },
        status: status,
    });
}
