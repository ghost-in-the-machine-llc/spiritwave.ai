import { streamGreeting, streamInvocation } from './services/spirit-wave.js';
import { htmlToDomStream } from './streams.js';

const output = document.getElementById('output');
 
await tryStream(streamGreeting);
await injectContinue();
await tryStream(streamInvocation);
await injectContinue();
const done = document.createElement('p');
done.textContent = 'all done';
output.append(done);

async function injectContinue() {
    const p = document.createElement('p');
    const button = document.createElement('button');
    button.textContent = 'continue...';
    p.append(button);
    output.append(p);
    p.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
    });
        
    return new Promise(resolve => {
        button.addEventListener('click', async () => {
            p.remove();
            resolve();
        });
    });
}

async function tryStream(getStream) {
    const domStream = htmlToDomStream(output);   
    try {
        const stream = await getStream();
        await stream.pipeTo(domStream);
    }
    catch (err) {
        // TODO: better handling of failures. maybe a service at some point
        // eslint-disable-next-line no-console
        alert(err?.constructor?.name + ' - ' + err.message);
    }
}