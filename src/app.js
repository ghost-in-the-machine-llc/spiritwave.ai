import { getGreeting } from './services/spirit-wave.js';
import { DOMAppendStream } from './streams.js';


const output = document.getElementById('output');
const domStream = new DOMAppendStream(output);   
 
const stream = await getGreeting();
stream.pipeTo(domStream);
