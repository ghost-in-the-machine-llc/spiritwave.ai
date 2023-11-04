import {
    PostgrestMaybeSingleResponse,
    PostgrestSingleResponse,
    SupabaseClient,
} from '@supabase/types';
import type { Database } from '../schema.gen.ts';
import type { Healer, Service, Step } from '../database.types.ts';
import {
    createClient,
    createServiceClient,
    handleResponse,
} from './supabase.ts';
import { getUserPayload } from './jwt.ts';

interface Session {
    healer: Healer;
    service: Service;
    step_id: number;
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

    /*
    async getHealer(healerId: number): Promise<Healer> {
        const res: PostgrestSingleResponse<Healer> = await this.#userClient
            .from('healer')
            .select()
            .eq('id', 99)
            .single();

        return await handleResponse(res);
    }

    async getService(serviceId: number): Promise<Service> {
        const res: PostgrestSingleResponse<Service> = await this.#userClient
            .from('service')
            .select()
            .eq('id', serviceId)
            .single();

        return await handleResponse(res);
    }

    async getSessionInfo(sessionId: number): Promise<StepInfo> {
        const res: PostgrestMaybeSingleResponse<StepInfo> = await this
            .#userClient
            .from('session')
            .select(`
                step_id,
                healer_id,
                service_id
            `)
            .eq('id', sessionId)
            .maybeSingle();

        return await handleResponse(res);
    }
    */

    async getSession(): Promise<Session> {
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
            .is('status', null)
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

    async updateSessionStep(sessionId: number, stepId: number) {
        const { error } = await this.#serviceClient
            .from('session')
            .update({ step_id: stepId })
            .eq('id', sessionId);

        if (error) throw error;
    }

    async saveMoment(): Promise<void> {
    }
}
