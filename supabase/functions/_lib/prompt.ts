import { Healer } from '../database.types.ts';
import { Service } from '../database.types.ts';
import { Step } from '../database.types.ts';
import type { Message } from './openai.ts';

const POST_SYNTAX = `Limit the response to no more than 100 words`;

const SYNTAX = `
For this response:
- wrap paragraphs with <p> tags.
- wrap implied headers with <h2> tags
- use <em> and <strong> tags when appropriate

${POST_SYNTAX}
`;

const syntaxWrap = (content: string | null) =>
    `${SYNTAX}\n${content ?? ''}\n${POST_SYNTAX}`;

export function createMessages(
    healer: Healer,
    service: Service,
    step: Step,
): Message[] {
    return [
        { role: 'system', content: `${healer.content}\n${service.content}` },
        { role: 'user', content: syntaxWrap(step.content) },
    ];
}

export function createMessagesFrom(
    messages: Message[],
    step: Step,
): Message[] {
    return [
        ...messages,
        { role: 'user', content: syntaxWrap(step.content) },
    ];
}
