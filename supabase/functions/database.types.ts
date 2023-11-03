import { Database } from './schema.gen.ts';

export type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> =
    Database['public']['Enums'][T];

export type Step = Tables<'step'>;
export type Healer = Tables<'healer'>;
export type Service = Tables<'service'>;
