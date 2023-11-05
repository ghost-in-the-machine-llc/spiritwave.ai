import { token } from './auth.js';

const SUPABASE_PROJECT_URL = window.SUPABASE_PROJECT_URL || '';
const API_URL = `${SUPABASE_PROJECT_URL}/functions/v1/play`;

const NO_CONTENT_MEANS_DONE = 204;

export async function getStream(sessionId) {
    const res = await getResponse(API_URL, sessionId);
    await handleNotOk(res);
    if (res.status === NO_CONTENT_MEANS_DONE) return null;
    return res.body.pipeThrough(new TextDecoderStream());

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

    throw new FetchError(res.statusCode, res.statusText, error);
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

