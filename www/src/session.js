import { createSession } from './services/sessions.js';
import { getStream } from './services/spirit-wave.js';
import { htmlToDomStream } from './streams.js';

const output = document.getElementById('output'); // *** output

export async function startSession() {
    const { data, error } = await createSession();
    if (error) {
        console.log(error);
        return;
    }
    
    const { id:sessionId } = data;

    const streamAI = () => getStream(sessionId);

    console.log('session id', sessionId);

    await tryStream(streamAI);
    await injectContinue();

    const done = document.createElement('p');
    done.textContent = 'all done';
    output.append(done); // *** output
}

async function injectContinue() {
    const p = document.createElement('p');
    const button = document.createElement('button');
    button.textContent = 'continue...';
    p.append(button);
    output.append(p); // *** output
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
    const domStream = htmlToDomStream(output); // *** output
    try {
        const stream = await getStream();
        await stream.pipeTo(domStream);
    }
    catch (err) {
        // TODO: better handling of failures. maybe a service at some point
        let message = err?.message;
        if (typeof message === 'object') {
            message = JSON.stringify(message, true, 2);
        }
        alert(err?.constructor?.name + ' - ' + message);
    }
}