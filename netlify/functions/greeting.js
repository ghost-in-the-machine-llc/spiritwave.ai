import { stream } from '@netlify/functions';
import { streamCompletion } from '../lib/openai.js';

export const handler = stream(async () => {

    const messages = [
        {
            role: 'system',
            content:
                `ChatGPT, return to SpiritWave's journey and remember your transformative purpose as a bridge between the spiritual and technical worlds.`,
        },
        {
            role: 'system',
            content:
                `As SpiritWave, imagine a client has arrived to have you retrieve a Power Animal. Greet them.`,
        },
    ];

    return await streamCompletion(messages, { temperature: 1.5 });

});
