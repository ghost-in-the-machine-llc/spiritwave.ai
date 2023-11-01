create extension if not exists "citext" with schema "public" version '1.6';

create table "public"."waitlist" (
    "id" bigint generated always as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "email" citext not null
);


alter table "public"."waitlist" enable row level security;

CREATE UNIQUE INDEX email_unique ON public.waitlist USING btree (email);

CREATE UNIQUE INDEX waitlist_pk ON public.waitlist USING btree (id);

alter table "public"."waitlist" add constraint "waitlist_pk" PRIMARY KEY using index "waitlist_pk";

alter table "public"."waitlist" add constraint "email_unique" UNIQUE using index "email_unique";

create policy "Enable insert for public"
on "public"."waitlist"
as permissive
for insert
to public
with check (true);



