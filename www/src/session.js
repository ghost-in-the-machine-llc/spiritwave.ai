import { getSession } from './services/sessions.js';
import { getStream } from './services/spirit-wave.js';
import { htmlToDomStream } from './streams.js';

const output = document.getElementById('output'); // *** output

export async function startSession() {
    const { session, error } = await getSession();
    if (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return;
    }
    const sessionId = session.id;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const stream = await getStream(sessionId);
        if (!stream) {
            injectDone();
            break;
        }
        await streamToDom(stream);
        await injectContinue();
    }
}



async function streamToDom(stream) {
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

async function injectDone() {
    const done = document.createElement('p');
    done.textContent = 'all done';
    output.append(done); // *** output
}