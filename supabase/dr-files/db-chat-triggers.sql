CREATE OR REPLACE FUNCTION public.member_chats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
begin
        insert into public.chat_members(user_id, chat_id, created_at, updated_at)
        select (new.user_id, new.chat_id, now(), now())
        where 0 = (select count(*) from chat_members where chat_id = new.chat_id and user_id = new.user_id);
 return new;
end;
$$


CREATE OR REPLACE FUNCTION public.notify_chatters()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
begin
    insert into public.notifications(user_id, message, mode, object_type, object_id)
    select cm.user_id, 'New Message', 'message', 'chats', new.chat_id
    FROM chat_members cm where cm.chat_id = new.chat_id and cm.user_id != new.user_id;
 return new;
end;
$$