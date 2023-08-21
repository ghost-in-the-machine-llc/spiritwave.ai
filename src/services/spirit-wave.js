
const API = '/.netlify/functions/greeting';

export async function getGreeting() {
    const res = await fetch(API);
    if (!res.ok) {
        const error = await res.json();
        throw error;
    }

    return res.body.pipeThrough(new TextDecoderStream());
}
