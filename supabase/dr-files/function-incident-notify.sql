CREATE OR REPLACE FUNCTION geo_users(x numeric, y numeric, distance int)
  RETURNS setof users as $$
    select * 
    from users
    where ST_DWithin(
            geom, 
            ST_MakePoint(x, y)::geography,
            distance, 
            true 
      );
$$ language sql;

-- Triggers need to be ROW level, not STATEMENT level
CREATE OR REPLACE FUNCTION public.notify_incident()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
begin
    insert into public.notifications(user_id, message, mode, object_type, object_id)
    select gu.id, new.name, 'create', 'incidents', new.id
    FROM geo_users(new.longitude, new.latitude, 1000) gu;

 return new;
end;
$$

    -- insert into public.notifications(user_id, message, mode, object_type, object_id)
    -- select (gu.id, new.name, 'create', 'incidents',new.id)
    -- FROM public.geo_users(new.longitude, new.latitude, 100000000000) gu;