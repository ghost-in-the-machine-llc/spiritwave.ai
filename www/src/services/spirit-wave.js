// Tests for this regex: https://regex101.com/r/5zXb2v/2
const ExtractPreContentRegex = /<pre>(.+?)<\/pre>/gims;

const getStream = (url) => async () => {
    const res = await getResponse(url);
    try {
        if (!res.ok) {
            let error = null;
            error = await res.text();
            if (error.startsWith('<!DOCTYPE html>')) {
                const matches = error.matchAll(ExtractPreContentRegex);
                let message = `${res.status}: ${res.statusText}`;
                for (const [, group] of matches) {
                    message += '\n' + (group ?? '');
                }

                throw message;
            }
            else {
                try {
                    error = JSON.parse(error);
                }
                finally {
                // eslint-disable-next-line no-unsafe-finally
                    throw error;
                }
            }
        }
        
        return res.body.pipeThrough(new TextDecoderStream());
    }
    catch (err) {
        //TODO: handle different failures: 
        // - res.json issues (might go in code block with .json()?)
        // - no body
        // - piping issues thru textdecoder?

        // eslint-disable-next-line no-console
        console.log (err);
        throw new FetchError(err);
    }
};

class FetchError extends Error {
    constructor(statusCode, statusText, err) {
        let message = err?.message ?? err ?? '';
        if (typeof message === 'object') {
            message = JSON.stringify(message, true, 2);
        }
        super(`Unable to retrieve AI response: \n${message}`);
    }
}

// connection or other pre-async failures
class ConnectivityError extends Error {
    constructor(err) {
        super(`Unable to connect with server to get AI response: \n${err}`);
    }
}

function getResponse(url) {
    try {
        return fetch(url, {
            headers: {
                /* spell-checker: disable */
                // TODO: use logged in supabase user
                // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
                /* spell-checker: enable */
            }
        });
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.log (err);
        throw new ConnectivityError(err);
    }
}

const SUPABASE_PROJECT_URL = window.SUPABASE_PROJECT_URL || '';
const API_URL = `${SUPABASE_PROJECT_URL}/functions/v1`;

const API_KEY = window.SUPABASE_API_KEY;
const API_KEY_QUERY = API_KEY ? `?apikey=${encodeURIComponent(API_KEY)}` : '';

const getUrl = path => `${API_URL}${path}${API_KEY_QUERY}`;

export const streamGreeting = getStream(getUrl('/greeting'));
export const streamInvocation = getStream(getUrl('/invocation'));
