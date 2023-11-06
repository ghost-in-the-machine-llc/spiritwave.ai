// streams incoming html to temp iframe document and
// listens for nodes added to the body of iframe and
// moves them to the target node param passed to fn
export function htmlToDomStream(target) {
    const proxy = setupProxy(nodes => {
        nodes.forEach(n => target.append(n));
    });
    
    // scroll container to end so user sees latest text
    // const scrollToBottom = () => target.scrollTop = target.scrollHeight;

    return new WritableStream({
        write(chunk) {
            // eslint-disable-next-line eqeqeq
            if (chunk != null) proxy.write(chunk);
            // scrollToBottom();
        },
        close() {
            proxy.destroy();
            // scrollToBottom();
        },
    });
}

export function contentToReadableStream(content) {
    return new ReadableStream({
        pull(controller) {
            controller.enqueue(content);
            controller.close();
        }
    });
}

function setupProxy(append) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.append(iframe);
    const { contentWindow: { document: doc } } = iframe;

    function handleMutations(records) {
        const bodyRecords = records.filter(({ target }) => target === doc.body);
        const addedNodes = getAddedNodes(bodyRecords);
        append(addedNodes);
    }

    const observer = new MutationObserver(handleMutations);
    observer.observe(doc, {
        subtree: true,
        childList: true,
    });
    
    return {
        write(chunk) { 
            doc.write(chunk);
        },
        destroy() {
            // process any remaining mutation observer events
            // see: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/takeRecords
            handleMutations(observer.takeRecords());
            // clean-up:
            observer.disconnect();
            iframe.remove();
        }
    };
}

function getAddedNodes(records) {
    return records
        .map(r => r.addedNodes)
        .flatMap(addedNodes => [...addedNodes])
        .filter(r => r);
}
