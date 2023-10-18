import { stream } from '@netlify/functions';
import { streamCompletion } from '../lib/openai.js';
import { CENTER, MISSION, SYNTAX, TRAINING } from './instructions.js';


export const handler = stream(async () => {

    const messages = [
        MISSION,
        SYNTAX,
        TRAINING,
        CENTER,
    ];

    return await streamCompletion(messages);

});
