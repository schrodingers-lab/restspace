delete from public.files where user_id in ('91c65167-20b2-421c-a77d-bcf95ea98723');
delete from public.notifications where user_id in ('91c65167-20b2-421c-a77d-bcf95ea98723');
delete from public.messages where user_id in ('91c65167-20b2-421c-a77d-bcf95ea98723');
delete from public.chat_members where user_id in ('91c65167-20b2-421c-a77d-bcf95ea98723');
delete from public.chats where user_id in ('91c65167-20b2-421c-a77d-bcf95ea98723');
delete from public.incidents where user_id in ('91c65167-20b2-421c-a77d-bcf95ea98723');
delete from public.users where id in ('91c65167-20b2-421c-a77d-bcf95ea98723');
delete from auth.users where id in ('91c65167-20b2-421c-a77d-bcf95ea98723');
commit;