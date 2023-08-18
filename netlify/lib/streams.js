
export class OpenAIContentStream extends TransformStream {
    // test cases: https://regex101.com/r/Bg9fLQ/1
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

export class LogStdOutStream extends TransformStream {
    constructor() {
        super({
            transform(chunk, controller) {
                process.stdout.write(chunk);
                controller.enqueue(chunk);
            },
        });
    }
}