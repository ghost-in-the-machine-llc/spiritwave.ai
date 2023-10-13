import { stream } from '@netlify/functions';
import { streamCompletion } from '../lib/openai.js';
import { CENTER, MISSION, TRAINING } from './instructions.js';


export const handler = stream(async () => {

    const messages = [
        MISSION,
        TRAINING,
        CENTER,
        {
            role: 'system',
            content: `limit overall response to 500 characters`
        }
    ];

    return await streamCompletion(messages);

});
