export class OpenAIContentStream extends TransformStream {
    // test cases: https://regex101.com/r/Bg9fLQ/1
    static contentRegEx = /data: {.+"delta":{"content":(".+")}/gm;

    constructor() {
        super({
            transform(chunk, controller) {
                const matches = chunk.matchAll(
                    OpenAIContentStream.contentRegEx,
                );

                for (const [, group] of matches) {
                    // parse the JSON to decode encoded characters like \", \', \n, etc.
                    // Note:
                    // - group is already surrounded by "..." (part of the regex capture group)
                    // - response is already JSON.encoded from the api, so strings are safe to parse
                    controller.enqueue(JSON.parse(group));
                }
            },
        });
    }
}

export type AllContentCallback = (content: string) => void;

export function getAllContent(callback: AllContentCallback) {
    let response = '';

    return new WritableStream({
        write(chunk) {
            response += chunk ?? '';
        },
        close() {
            callback(response);
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
