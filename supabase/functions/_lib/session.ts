import {
    PostgrestMaybeSingleResponse,
    PostgrestSingleResponse,
    SupabaseClient,
} from '@supabase/types';
import type { Database } from '../schema.gen.ts';
import type { Healer, Service, Step } from '../database.types.ts';
import { handleResponse } from './supabase.ts';

interface StepInfo {
    step_id: number;
    healer_id: number;
    service_id: number;
}

interface Session {
    healer: Healer;
    service: Service;
    step_id: number;
}

export class SessionManager {
    #client: SupabaseClient<Database>;

    constructor(client: SupabaseClient<Database>) {
        this.#client = client;
    }
    /*
    async getHealer(healerId: number): Promise<Healer> {
        const res: PostgrestSingleResponse<Healer> = await this.#client
            .from('healer')
            .select()
            .eq('id', 99)
            .single();

        return await handleResponse(res);
    }

    async getService(serviceId: number): Promise<Service> {
        const res: PostgrestSingleResponse<Service> = await this.#client
            .from('service')
            .select()
            .eq('id', serviceId)
            .single();

        return await handleResponse(res);
    }

    async getSessionInfo(sessionId: number): Promise<StepInfo> {
        const res: PostgrestMaybeSingleResponse<StepInfo> = await this
            .#client
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

    async getSession(sessionId: number): Promise<Session> {
        const res: PostgrestSingleResponse<Session> = await this
            .#client
            .from('session')
            .select(`
                id,
                healer(*),
                service(*),
                step_id
            `)
            .eq('id', sessionId)
            .single();

        return await handleResponse(res);
    }

    async updateSessionStep(sessionId: number, stepId: number) {
        const { error } = await this.#client
            .from('session')
            .update({ step_id: stepId })
            .eq('id', sessionId);

        if (error) throw error;
    }

    async getStepAfter(stepId: number | null): Promise<Step> {
        let query = this.#client
            .from('step')
            .select();
        query = stepId
            ? query.eq('prior_id', stepId)
            : query.is('prior_id', null);

        const res: PostgrestMaybeSingleResponse<Step> = await query
            .maybeSingle();

        return handleResponse(res);
    }
}
