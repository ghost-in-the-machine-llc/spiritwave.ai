import { getSession, restoreSession, Status } from './services/sessions.js';
import { getStream } from './services/spirit-wave.js';
import { contentToReadableStream, htmlToDomStream } from './streams.js';

const output = document.getElementById('output'); // *** output

export async function startSession() {
    try {

    
        const { session, error } = await getSession();
        if (error) {
        // eslint-disable-next-line no-console
            console.log(error);
            return;
        }
        const sessionId = session.id;

        if (session.status === Status.Active) {
            await injectRestore(sessionId);
            await injectContinue();
        }

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
    catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        alert('Oh noes, something went wrong!\n\n' + err.message);
    }
}

async function streamToDom(stream) {
    const domStream = htmlToDomStream(output); // *** output
    return stream.pipeTo(domStream);
}

async function injectRestore(sessionId) {
    const p = document.createElement('p');
    p.textContent = 'Restoring healing session...';
    output.append(p); // *** output
    // p.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'end',
    // });

    const { data, error } = await restoreSession(sessionId);
    if (error) throw error;

    const stream = contentToReadableStream(data.responses);
    await streamToDom(stream);
    p.remove();
}

async function injectContinue() {
    const p = document.createElement('p');
    const button = document.createElement('button');
    button.textContent = 'continue...';
    p.append(button);
    output.append(p); // *** output
    // p.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'end',
    // });
        
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