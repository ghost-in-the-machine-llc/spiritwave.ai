const getStream = (url) => async () => {
    const res = await fetch(url);
    if (!res.ok) {
        const error = await res.json();
        throw error;
    }

    return res.body.pipeThrough(new TextDecoderStream());
};

const API = '/.netlify/functions';

export const streamGreeting = getStream(`${API}/greeting`);
export const streamInvocation = getStream(`${API}/invocation`);
