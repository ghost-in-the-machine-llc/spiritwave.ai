import { getGreeting } from './services/spirit-wave.js';
import { DOMAppendStream, PhraseTransformStream, SpeakStream } from './streams.js';


const output = document.getElementById('output');

const startButton = document.getElementById('start-button');
startButton.addEventListener('click', async () => {
    const domStream = new DOMAppendStream(output);    
    const stream = await getGreeting();
    const [text, speech] = stream.tee();
    
    text.pipeTo(domStream);
    
    speech
        .pipeThrough(new PhraseTransformStream())
        .pipeTo(new SpeakStream());

});
