
export class DOMAppendStream extends WritableStream {
    constructor(node) {
        super({
            write(chunk) {
                node.append(chunk);
            },
        });
    }
}
