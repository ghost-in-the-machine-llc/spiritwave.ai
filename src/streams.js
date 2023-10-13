
export function domAppendStream(node) {
    return new WritableStream({
        write(chunk) {
            // eslint-disable-next-line eqeqeq
            if (chunk != null) node.append(chunk);
            node.scrollTop = node.scrollHeight;
        },
        close() {
            // no-op
        }
    });
}

export function paragraphTransformStream() {
    let p = null;
    const newParagraph = controller => {
        p = document.createElement('p');
        controller.enqueue(p);
    };

    return new TransformStream({
        start(controller) {
            newParagraph(controller);
        },
        transform(chunk, controller) {
            if ([...chunk].join('') === '.\n\n') {
                p.append('.');
                newParagraph(controller);
                return;
            }

            p.append(chunk);
            controller.enqueue();
        },
    });
}
