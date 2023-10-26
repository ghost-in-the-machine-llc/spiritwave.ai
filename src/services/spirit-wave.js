const getStream = (url) => async () => {
    const res = await fetch(url, {
        headers: {
            /* spell-checker: disable */
            // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
            /* spell-checker: enable */
        }
    });
    if (!res.ok) {
        const error = await res.json();
        throw error;
    }

    return res.body.pipeThrough(new TextDecoderStream());
};

const API = '/api/v1';

export const streamGreeting = getStream(`${API}/greeting`);
export const streamInvocation = getStream(`${API}/invocation`);
