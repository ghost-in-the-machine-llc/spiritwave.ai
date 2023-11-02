import {
    PostgrestMaybeSingleResponse,
    PostgrestSingleResponse,
    SupabaseClient,
} from 'https://esm.sh/@supabase/supabase-js@2/dist/module/index.d.ts';
import type { Database, Healer, Service, Step } from '../database.types.ts';
import { handleResponse } from './supabase.ts';

interface StepInfo {
    stepId: number;
    healerId: number;
    serviceId: number;
}

export class SessionManager {
    #client: SupabaseClient<Database>;

    constructor(client: SupabaseClient<Database>) {
        this.#client = client;
    }

    async getHealer(healerId: number): Promise<Healer> {
        const res: PostgrestSingleResponse<Healer> = await this.#client
            .from('healer')
            .select()
            .eq('id', healerId)
            .single();

        return await handleResponse(res, { throwOnNoData: true });
    }

    async getService(serviceId: number): Promise<Service> {
        const res: PostgrestSingleResponse<Service> = await this.#client
            .from('service')
            .select()
            .eq('id', serviceId)
            .single();

        return await handleResponse(res, { throwOnNoData: true });
    }

    async getSessionInfo(sessionId: number): Promise<StepInfo> {
        const res: PostgrestMaybeSingleResponse<StepInfo> = await this
            .#client
            .from('session')
            .select(`
                stepId: step_id,
                healerId: healer_id,
                serviceId: service_id
            `)
            .eq('id', sessionId)
            .maybeSingle();

        return await handleResponse(res, { throwOnNoData: true });
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
