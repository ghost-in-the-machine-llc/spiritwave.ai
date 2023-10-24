import { stream } from '@netlify/functions';
import { streamCompletion } from '../lib/openai.js';
import { INVOCATION, MISSION, SYNTAX } from './_prompts/instructions.js';


export const handler = stream(async () => {

    const messages = [
        MISSION,
        SYNTAX,
        INVOCATION,
    ];

    return await streamCompletion(messages);

});
