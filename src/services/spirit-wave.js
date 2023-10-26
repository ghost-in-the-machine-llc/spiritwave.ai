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

const SUPABASE_PROJECT_URL = window.SUPABASE_PROJECT_URL || '';
const API = `${SUPABASE_PROJECT_URL}/functions/v1`;

const API_KEY = window.SUPABASE_API_KEY;

const API_KEY_QUERY = API_KEY ? `?apikey=${encodeURIComponent(API_KEY)}` : '';


const getUrl = path => `${API}${path}${API_KEY_QUERY}`;

console.log('API URL', API);
console.log('API KEY', API_KEY_QUERY);


export const streamGreeting = getStream(getUrl('/greeting'));
export const streamInvocation = getStream(getUrl('/invocation'));
