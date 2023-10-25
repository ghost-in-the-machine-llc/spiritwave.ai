// streams incoming html to temp iframe document and
// listens for nodes added to the body of iframe and
// moves them to the target node param passed to fn
export function domAppendStream(target) {
    const append = added => added.forEach(n => target.append(n)); 
    const iframe = setupProxy(); // removed in stream.close
    
    const handleMutations = (records) => {
        const bodyRecords = iframe.filterRecords(records);
        const addedNodes = getAddedNodes(bodyRecords);
        append(addedNodes);
    };

    const observer = new MutationObserver(records => {
        const bodyRecords = iframe.filterRecords(records);
        const addedNodes = getAddedNodes(bodyRecords);
        append(addedNodes);
    }); // is drained and disconnected in stream.close

    observer.observe(iframe.document, {
        subtree: true,
        childList: true,
    });

    // scroll container to end so user sees latest text
    const scrollToBottom = () => target.scrollTop = target.scrollHeight;

    return new WritableStream({
        write(chunk) {
            // eslint-disable-next-line eqeqeq
            if (chunk != null) iframe.write(chunk);
            scrollToBottom();
        },
        close() {
            // process any remaining mutation observer events
            // see: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/takeRecords
            handleMutations(observer.takeRecords());
            scrollToBottom();
            // clean-up:
            observer.disconnect();
            iframe.remove();
        },
    });
}

function setupProxy() {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const { contentWindow: { document: doc } } = iframe;
    
    return {
        document: doc,
        body: doc.body,
        filterRecords(records) {
            return records.filter(({ target }) => target === doc.body);
        },
        remove() { 
            iframe.remove(); 
        },
        write(chunk) { 
            doc.write(chunk);
        }
    };
}

function getAddedNodes(records) {
    return records
        .map(r => r.addedNodes)
        .flatMap(addedNodes => [...addedNodes])
        .filter(r => r);
}
