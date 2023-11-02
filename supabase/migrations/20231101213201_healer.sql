create table "public"."healer" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "content" text not null,
    "avatar" text
);


CREATE UNIQUE INDEX healer_pkey ON public.healer USING btree (id);

alter table "public"."healer" add constraint "healer_pkey" PRIMARY KEY using index "healer_pkey";

