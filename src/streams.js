function addIFrame() {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const { contentWindow: { document: doc } } = iframe;
    
    return {
        document: doc,
        body: doc.body,
        isBodyTarget(target) {
            return target === doc.body;
        },
        remove() { 
            iframe.remove(); 
        },
        write(chunk) { 
            iframe.contentWindow.document.write(chunk);
        }
    };
}

export function domAppendStream(node) {

    // iframe is removed in stream.close below
    const iframe = addIFrame();

    // moves nodes added to the body of iframe to the 
    // target "node" param passed to the function
    const handleMutations = (records) => {
        records = records.filter(({ target }) => iframe.isBodyTarget(target));
        if (!records.length) return;
        
        // console.log('filtered', addedToBody);
        const addedNodes = getAddedNodes(records);
        
        if (!addedNodes.length) return;
        
        addedNodes.forEach(n => node.append(n));  
    };

    // observer is drained and disconnected in stream.close
    const observer = new MutationObserver(handleMutations);

    observer.observe(iframe.document, {
        subtree: true,
        childList: true,
    });

    // scroll container to end so user sees latest text
    const scrollToBottom = () => node.scrollTop = node.scrollHeight;

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

function getAddedNodes(records) {
    return records
        .map(r => r.addedNodes)
        .flatMap(addedNodes => [...addedNodes])
        .filter(r => r);
}
