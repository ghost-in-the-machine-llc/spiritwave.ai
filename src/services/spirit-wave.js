
const API = '/.netlify/functions/hello';

export async function getGreeting() {
    const { body } = await fetch(API);
    // TODO: check status code
    
    return body.pipeThrough(new TextDecoderStream());
}
