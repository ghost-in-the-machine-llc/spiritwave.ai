import { createSession } from './services/sessions.js';
import { getStream } from './services/spirit-wave.js';
import { htmlToDomStream } from './streams.js';

const output = document.getElementById('output'); // *** output

export async function startSession() {
    // const { data, error } = await createSession();
    // if (error) {
    //     // eslint-disable-next-line no-console
    //     console.log(error);
    //     return;
    // }
    
    // const { id: sessionId } = data;
    const stream = await getStream(16 /*sessionId*/);
    await tryStream(stream);
    await injectContinue();

    const done = document.createElement('p');
    done.textContent = 'all done';
    output.append(done); // *** output
}

async function tryStream(stream) {
    const domStream = htmlToDomStream(output); // *** output
    try {
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
