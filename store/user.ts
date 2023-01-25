import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import { addToNewMap, arrayToMap } from '../components/util/data'

/**
 * @param {number} userId load user profile
 * @param {array[number]} userIds load users profile
 */
export const useStore = (props) => {
  const authUser = useUser();
  const supabase = useSupabaseClient();
  const [userIds, setUserIds] = useState([])
  const [userProfiles, setUserProfiles] = useState(new Map())
  const [authUserProfile, setAuthUserProfile] = useState(undefined)

  // Update when the props changes (effect to listen for [props.userId])
  useEffect(() => {
    const handleAsync = async () => {
      // return new map to trigger consumer hooks
      return await fetchUser(props.userId, (user) => { setUserProfiles(addToNewMap(userProfiles, user.id, user))}, supabase);
    }
    
    if (props?.userId?.length > 0) {
      if(userIds.includes(props.userId)){
        return;
      }
      if(!userIds.includes(props.userId)){
          setUserIds([...userIds, props.userId]);
          handleAsync();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userId, supabase])

  useEffect( () => {
    const handleAsync = async () => {
      return await fetchUsers(props.userIds, (users) => setUserProfiles(arrayToMap(users,'id')), supabase);
    }
    if (props.userIds && props.userIds.length > 0){
      handleAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userIds, supabase])


  useEffect( () => {
    // load auth user profile
    const handleAsync = async () => {
      return await fetchUser(authUser.id, (userProfile) => setAuthUserProfile(userProfile), supabase);
    }

    // check if authuser and profile
    if (authUser){
      // load from supabase
      handleAsync();
    } else{
      // clear profile
      setAuthUserProfile(undefined);
    }
    
  }, [authUser, supabase])

  return {
    // We can export computed values here to map the authors to each message
    authUser,
    authUserProfile,
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


/**
 * hide a message from the display
 * @param {number} message_id
 */
export const updateProfile = async (newProfile, supabase) => {
  try {
    let result = await supabase.from('users')
          .update(newProfile).eq('id', newProfile.id);
    return result
  } catch (error) {
    console.log('error', error)
  }
}

