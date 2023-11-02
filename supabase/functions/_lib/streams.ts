export class OpenAIContentStream extends TransformStream {
    // test cases: https://regex101.com/r/Bg9fLQ/1
    static contentRegEx = /data: {.+"delta":{"content":(".+")}/gm;

    constructor() {
        super({
            transform(chunk, controller) {
                const matches = chunk.matchAll(
                    OpenAIContentStream.contentRegEx,
                );
                try {
                    for (const [, group] of matches) {
                        // parse the JSON to decode
                        // encoded characters like \", \', \n, etc.
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

export function getAllContent() {
    let response = '';

    return new TransformStream({
        transform(chunk) {
            response += chunk ?? '';
        },
        flush(controller) {
            controller.enqueue(response);
        },
    });
}

export function streamToConsole(): WritableStream {
    return new WritableStream({
        write(chunk) {
            console.log('%c' + chunk, 'color: steelblue');
        },
    });
}
