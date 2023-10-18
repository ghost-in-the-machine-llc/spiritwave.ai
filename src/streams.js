
export function domAppendStream(node) {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    // iframe is removed in stream.close below
    const { contentWindow: { document: frame } } = iframe;

    const processRecords = (records) => {
        const [newNodes = null] = records
            .filter(r => r.target === frame.body)
            .map(r => r.addedNodes);
        if (newNodes) newNodes.forEach(n => node.append(n));
    };

    const observer = new MutationObserver(processRecords);
    
    observer.observe(frame, {
        subtree: true,
        childList: true,
    });
    // observer is drained and disconnected in stream.close

    const scrollToBottom = () => node.scrollTop = node.scrollHeight;

    return new WritableStream({
        write(chunk) {
            // eslint-disable-next-line eqeqeq
            if (chunk != null) frame.write(chunk);
            scrollToBottom();
        },
        close() {
            // process any remaining mutation observer events
            // see: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/takeRecords
            processRecords(observer.takeRecords());
            scrollToBottom();
            observer.disconnect();
            iframe.remove();
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
