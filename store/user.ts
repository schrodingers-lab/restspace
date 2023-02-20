import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import { addToNewMap, arrayToMap } from '../components/util/data'
import { Store } from 'pullstate';
import { enableMapSet } from 'immer';

enableMapSet();

export const UserStore = new Store({
  userProfiles: new Map(),
  userIds: [],
  authUser: undefined,
  authUserProfile: undefined,
});

/**
 * @param {number} userId load user profile
 * @param {array[number]} userIds load users profile
 */
export const useUserStore = (props) => {
  const authUser = useUser();
  const supabase = useSupabaseClient();
  const [userIds, setUserIds] = useState([])
  
  // Update when the props changes (effect to listen for [props.userId])
  useEffect(() => {
    if (props?.userId?.length > 0) {
      if(userIds.includes(props.userId)){
        return;
      }
      if(!userIds.includes(props.userId)){
          setUserIds([...userIds, props.userId]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userId, supabase])

  useEffect( () => {
    if (props.userIds && props.userIds.length > 0){
      setUserIds(props.userIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userIds, supabase])


  useEffect( () => {
    const handleAsync = async () => {
      const result = await fetchUsers(userIds, supabase);
      console.log("userIds", userIds, result)
      UserStore.update(s => {
        s.userProfiles = arrayToMap(result.data,'id')
      });
    }
    if (userIds && userIds.length > 0){
      handleAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIds, supabase])

  useEffect( () => {
    // load auth user profile
    const handleAsync = async () => {
      const result = await fetchUser(authUser.id, supabase);
      UserStore.update(s => {
        s.authUser = authUser;
        s.authUserProfile = result.data;
      });

      return result; 
    }

    // check if authuser and profile
    if (authUser){
      // load from supabase
      handleAsync();
    } else{
      // clear profile
      UserStore.update(s => {
        s.authUser = null;
        s.authUserProfile = null;
      });
    }
    
  }, [authUser, supabase])


  return {
    // We can export computed values here to map the authors to each message
    userIds,
  }
}

/**
 * Fetch a single user
 * @param {number} userId
 */
export const fetchUser = async (userId,  supabase) => {
  try {
    let { data, error } = await supabase.from('users').select(`*`).eq('id', userId).single()
    return { data, error }
  } catch (error) {
    console.error('error', error)
  }
}

/**
 * Fetch a multiple user
 * @param {array} userIds
 */
export const fetchUsers = async (userIds, supabase) => {
  try {
    const { data, error } = await supabase.from('users').select(`*`).in('id', userIds)
    return { data, error }
  } catch (error) {
    console.error('error', error)
  }
}


/**
 * hide a message from the display
 * @param {number} message_id
 */
export const updateProfile = async (newProfile, supabase) => {
  try {
    let result = await supabase.from('users')
          .update(newProfile).eq('id', newProfile.id);
    UserStore.update(s => {
      s.userProfiles = s.userProfiles.set(result.newProfile.id, newProfile)
    });
    return result
  } catch (error) {
    console.log('error', error)
  }
}

