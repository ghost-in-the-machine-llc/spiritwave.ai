import { getGreeting } from './services/spirit-wave.js';
import { DOMAppendStream } from './streams.js';

const output = document.getElementById('output');
const domStream = new DOMAppendStream(output);   
 
try {
    const stream = await getGreeting();
    stream.pipeTo(domStream);
}
catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
}
