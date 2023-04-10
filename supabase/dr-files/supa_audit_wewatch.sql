-- Enable auditing
select audit.enable_tracking('public.messages'::regclass);
select audit.enable_tracking('public.chats'::regclass);
select audit.enable_tracking('public.incidents'::regclass);
select audit.enable_tracking('public.users'::regclass);