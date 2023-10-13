import { stream } from '@netlify/functions';
import { streamCompletion } from '../lib/openai.js';
import { INVOCATION, MISSION } from './instructions.js';


export const handler = stream(async () => {

    const messages = [
        MISSION,
        INVOCATION,
        // {
        //     role: 'system',
        //     content: `limit overall response to 500 characters`
        // }
    ];

    return await streamCompletion(messages);

});
