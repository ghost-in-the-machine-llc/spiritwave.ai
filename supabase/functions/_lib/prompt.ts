import { Healer } from '../database.types.ts';
import { Service } from '../database.types.ts';
import { Step } from '../database.types.ts';
import type { Message } from './openai.ts';

export const SYNTAX = `
        For responses:
        - wrap paragraphs with <p> tags.
        - wrap implied headers with <h2> tags
        - use <em> and <strong> tags when appropriate
        - limit to no more than 250 characters
    `;

export function createMessages(
    healer: Healer,
    service: Service,
    step: Step,
): Message[] {
    return [
        { role: 'user', content: `${healer.content}\n${service.content}` },
        { role: 'user', content: `${SYNTAX}\n${step.content}` },
    ];
}
