import { streamGreeting } from './services/spirit-wave.js';
import { domAppendStream } from './streams.js';

const output = document.getElementById('output');
 
await tryStream(streamGreeting);
const done = document.createElement('p');
done.textContent = 'all done';
output.append(done);

async function tryStream(getStream) {
    const domStream = domAppendStream(output);   
    // const paragraphStream = paragraphTransformStream();
    try {
        const stream = await getStream();
        await stream
            // .pipeThrough(paragraphStream)
            .pipeTo(domStream);
    }
    catch (err) {
        // TODO: figure how how to deal with failures
        // eslint-disable-next-line no-console
        console.error('oh noes!', err);
    }
}