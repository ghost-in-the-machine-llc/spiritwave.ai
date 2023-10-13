import { OpenAIContentStream } from './streams.js';

const API_KEY = process.env.OPENAI_API_KEY;
const COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';

export async function streamCompletion(messages, options) {

    // The response body returned from "fetch" is a "ReadableStream",
    // so you can return it directly in your streaming response
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
                temperature: 1.2, // TODO: what is good default?
                // temperature: 2.0, // TODO: change at different times?
                stream: true,
                ...options
            }),
        }
    );

    if (!res.ok) {
        return {
            headers: {
                'content-type': 'application/json',
            },
            statusCode: res.status,
            body: res.body,
        };
    }

    const stream = res.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new OpenAIContentStream());
        // .pipeThrough(new LogStdOutStream());

    

    return {
        headers: {
            'content-type': 'text/event-stream',
        },
        statusCode: res.status,
        body: stream,
    };
}
