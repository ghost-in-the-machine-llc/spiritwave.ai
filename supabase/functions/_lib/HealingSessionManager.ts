import type {
    PostgrestMaybeSingleResponse,
    PostgrestSingleResponse,
    SupabaseClient,
} from '@supabase/types';
import type { Database } from '../schema.gen.ts';
import type {
    Healer,
    Service,
    SessionStatus,
    Step,
} from '../database.types.ts';
import type { Message } from './openai.ts';

import { createServiceClient, handleResponse } from './supabase.ts';
import { getUserPayload } from './jwt.ts';

interface SessionInfo {
    id: number;
    step_id: number;
    status: SessionStatus;
}

interface Session {
    id: number;
    step_id: number;
    healer: Healer;
    service: Service;
}

interface NewMoment {
    step_id: number;
    messages: Message[];
    response: string;
}

export enum Status {
    Created = 'created',
    Active = 'active',
    Done = 'done',
}

export class HealingSessionManager {
    // #userClient: SupabaseClient<Database>;
    #serviceClient: SupabaseClient<Database>;
    #uid: string;
    // This is "healing session", not a server session
    #sessionId: number;

    constructor(userToken: string, sessionId: number) {
        const payload = getUserPayload(userToken);
        this.#uid = payload.sub;
        this.#sessionId = sessionId;

        // this.#userClient = createClient(userToken);
        this.#serviceClient = createServiceClient();
    }

    async getOpenSessionInfo(): Promise<SessionInfo> {
        const res: PostgrestMaybeSingleResponse<SessionInfo> = await this
            .#serviceClient
            .from('session')
            .select(`
                id,
                step_id,
                status
            `)
            // eventually add service_id and healer_id
            .eq('id', this.#sessionId)
            .eq('uid', this.#uid)
            .maybeSingle();

        return await handleResponse(res);
    }

    async getFullSessionInfo(): Promise<Session> {
        const res: PostgrestSingleResponse<Session> = await this
            .#serviceClient
            .from('session')
            .select(`
                id,
                healer(*),
                service(*),
                step_id
            `)
            // eventually add service_id and healer_id
            .eq('id', this.#sessionId)
            .eq('uid', this.#uid)
            .neq('status', Status.Done)
            .single();

        return await handleResponse(res);
    }

    async getStepAfter(stepId: number | null): Promise<Step> {
        let query = this.#serviceClient
            .from('step')
            .select();
        query = stepId
            ? query.eq('prior_id', stepId)
            : query.is('prior_id', null);

        const res: PostgrestMaybeSingleResponse<Step> = await query
            .maybeSingle();

        return handleResponse(res);
    }

    async #updateSession(update: object): Promise<void> {
        const { error } = await this.#serviceClient
            .from('session')
            .update(update)
            .eq('id', this.#sessionId);

        if (error) throw error;
    }

    updateSessionStep(stepId: number): Promise<void> {
        return this.#updateSession({ step_id: stepId, status: Status.Active });
    }

    updateSessionStatus(status: SessionStatus): Promise<void> {
        return this.#updateSession({ status });
    }

    async getPriorMessages(stepId: number | null): Promise<Message[]> {
        if (!stepId) return [];

        const res = await this.#serviceClient
            .from('moment')
            .select('*')
            .match({
                session_id: this.#sessionId,
                step_id: stepId,
                uid: this.#uid,
            })
            .single();

        const data = handleResponse(res)!;
        return JSON.parse(<string> data.messages).messages;
    }

    async saveMoment(moment: NewMoment): Promise<void> {
        // PG doesn't deal with whole arrays in json columns,
        // so we make it an object... :shrug:
        const messages = {
            messages: [
                ...moment.messages,
                { role: 'assistant', content: moment.response },
            ],
        };

        const { error } = await this.#serviceClient
            .from('moment')
            .insert({
                ...moment,
                // parse the response string as JSON to decode
                // encoded characters like \", \', \n, etc.
                response: JSON.parse(JSON.stringify(moment.response)),
                messages: JSON.stringify(messages),
                uid: this.#uid,
                session_id: this.#sessionId,
            });

        if (error) throw error;
    }
}
