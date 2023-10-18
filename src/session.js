import { streamGreeting, streamInvocation } from './services/spirit-wave.js';
import { domAppendStream, paragraphTransformStream } from './streams.js';

const output = document.getElementById('output');
 
await tryStream(streamGreeting);
await injectContinue();
await tryStream(streamInvocation);
await injectContinue();
output.append('all done');

async function injectContinue() {
    const p = document.createElement('p');
    const button = document.createElement('button');
    button.textContent = 'continue...';
    p.append(button);
    output.append(p);
        
    return new Promise(resolve => {
        button.addEventListener('click', async () => {
            p.remove();
            resolve();
        });
    });
}

async function tryStream(getStream) {
    const domStream = domAppendStream(output);   
    const paragraphStream = paragraphTransformStream();
    try {
        const stream = await getStream();
        await stream
            .pipeThrough(paragraphStream)
            .pipeTo(domStream);
    }
    catch (err) {
        // TODO: figure how how to deal with failures
        // eslint-disable-next-line no-console
        console.error('oh noes!', err);
    }
}