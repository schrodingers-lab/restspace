import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'

/**
 * @param {number} chatId the currently selected Chat
 */
export const useStore = (props) => {
  const [userIds, setUserIds] = useState([])
  const [userProfiles, setUserProfiles] = useState(new Map())

  const supabase = useSupabaseClient();

  // load the user profiles
  const arrayToMap = (array: any[], key: string) => {
    return array.reduce((map, obj) => {
        map.set(obj[key], obj);
        return map;
    }, new Map());
  }

  // Update when the route changes
  useEffect(() => {
    const handleAsync = async () => {
      return await fetchUser(props.userId, (user) => setUserProfiles(arrayToMap([...userIds, user],'id')), supabase);
    }

    if (props?.userId > 0) {
      if(userIds.includes(props.userId)){
        return;
      }
      
      if(!userIds.includes(props.userId)){
          setUserIds([...userIds, props.userId]);
          handleAsync();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userId])

  useEffect( () => {
    const handleAsync = async () => {
      return await fetchUsers(props.userIds, (users) => setUserProfiles(arrayToMap(users,'id')), supabase);
    }
    if (props.userIds && props.userIds.length > 0){
      handleAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userIds])

  
  return {
    // We can export computed values here to map the authors to each message
    userProfiles,
    userIds,
  }
}


/**
 * Fetch a single user
 * @param {number} userId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUser = async (userId, setState, supabase) => {
  try {
    let { data } = await supabase.from('users').select(`*`).eq('id', userId)
    let user = data[0]
    if (setState) setState(user)
    return user
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Fetch a multiple user
 * @param {array} userIds
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUsers = async (userIds, setState, supabase) => {
  try {
    const { data } = await supabase.from('users').select(`*`).in('id', userIds)
    const users = data
    if (setState) setState(users)
    return users
  } catch (error) {
    console.log('error', error)
  }
}
