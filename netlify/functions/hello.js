import { stream } from '@netlify/functions';
import { streamCompletion } from '../lib/openai.js';

export const handler = stream(async (event) => {

    const pie =
    event.queryStringParameters?.pie ??
    'zombie apocalypse';

    const messages = [
        {
            role: 'system',
            content:
                `You are a baker, create a name and describe a kind of pie 
                that matches the users input in 120 character, quote the pie name.
                Then provide 300 characters describing the ingredients.`,
        },
        // Use "slice" to limit the length of the input to 500 characters
        { role: 'user', content: pie.slice(0, 500) },
    ];

    return await streamCompletion(messages, { temperature: 1.5 });

});
