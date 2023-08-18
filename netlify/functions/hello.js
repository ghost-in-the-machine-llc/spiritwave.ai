const { stream } = require('@netlify/functions');

const API_KEY = process.env.OPENAI_API_KEY;

class OpenAIContentStream extends TransformStream {
    static contentRegEx = /data: {.+"delta":{"content":(".+")}/gm;

    constructor() {
        super({
            transform(chunk, controller) {
                const matches = chunk.matchAll(OpenAIContentStream.contentRegEx);
                try {
                    for (const [, group] of matches) {
                        // parse the JSON to decode
                        // encoded characters like \", \', etc.
                        controller.enqueue(JSON.parse(group));
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.log(err);
                }
            },
        });
    }
}

// eslint-disable-next-line no-unused-vars
class LogStdOutStream extends TransformStream {
    constructor() {
        super({
            transform(chunk, controller) {
                process.stdout.write(chunk);
                controller.enqueue(chunk);
            },
        });
    }
}

exports.handler = stream(async (event) => {
    // Get the request from the request query string, or use a default
    const pie =
        event.queryStringParameters?.pie ??
        'something inspired by a springtime garden';

    // The response body returned from "fetch" is a "ReadableStream",
    // so you can return it directly in your streaming response
    const res = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content:
                            `You are a baker, create a name and describe a kind of pie 
                            that matches the users input in 120 character.`,
                            // The provide 300 characters describing the ingredients.`,
                    },
                    // Use "slice" to limit the length of the input to 500 characters
                    { role: 'user', content: pie.slice(0, 500) },
                ],
                temperature: 1.5,
                stream: true,
            }),
        }
    );

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
});
