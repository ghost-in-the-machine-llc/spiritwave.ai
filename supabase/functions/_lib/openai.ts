import { Status } from 'http/status';
import { HttpError } from './http.ts';
import { OpenAIContentStream } from './streams.ts';

const API_KEY = Deno.env.get('OPENAI_API_KEY');
const COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';

export interface Message {
    role: string;
    content: string;
}

export async function streamCompletion(
    messages: Message[],
): Promise<{ status: Status; stream: ReadableStream }> {
    console.log(messages);
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
        console.log(text);
        let message = text;
        try {
            message = JSON.parse(text);
        } catch (_) { /* no-op */ }

        throw new HttpError(status, message);
    }

    const stream = body!
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new OpenAIContentStream());

    return { status, stream };
}
