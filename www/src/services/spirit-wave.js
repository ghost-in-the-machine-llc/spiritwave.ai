import { token } from './auth.js';

const SUPABASE_PROJECT_URL = window.SUPABASE_PROJECT_URL || '';
const API_URL = `${SUPABASE_PROJECT_URL}/functions/v1/play`;

export async function getStream(sessionId) {
    const res = await getResponse(API_URL, sessionId);

    try {
        await handleNotOk(res);
        return res.body.pipeThrough(new TextDecoderStream());
    }
    catch (err) {
        //TODO: handle more failures: 
        // - no body
        // - piping issues thru textdecoder?

        // eslint-disable-next-line no-console
        console.log (err);
        if (err instanceof ConnectivityError) throw err;
        throw new FetchError(err);
    }
}

function getResponse(url, sessionId) {
    try {
        return fetch(`${url}?sessionId=${sessionId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.log (err);
        throw new ConnectivityError(err);
    }
}


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

async function handleNotOk(res) {
    if (res.ok) return; 

    let error = null;
    error = await res.text();
    handleHtmlError(error, res);

    try {
        error = JSON.parse(error);
    }
    catch (_) { /* no-op */ }

    throw error;
}


// Tests for this regex: https://regex101.com/r/5zXb2v/2
const ExtractPreContentRegex = /<pre>(.+?)<\/pre>/gims;

function handleHtmlError(error, res) {
    // usually proxy dev server
    if (!error.startsWith('<!DOCTYPE html>')) return;

    const matches = error.matchAll(ExtractPreContentRegex);
    let message = `${res.status}: ${res.statusText}`;
    for (const [, group] of matches) {
        message += '\n' + (group ?? '');
    }

    throw message;
}

