import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import { arrayToMap } from '../components/util/data'

/**
 * @param {number} chatId the currently selected Chat
 */
export const useStore = (props) => {
  const [notifications, setNotifications] = useState([])
  const [activeNotifications, setActiveNotifications] = useState([])
  const [userId, setUserId] = useState()

  const [updateNotification, handleUpdateNotification] = useState(null)
  const [newNotification, handleNewNotification] = useState(null)

  const supabase = useSupabaseClient();

  // Load initial data and set up listeners
  useEffect(() => {
    // Get Notifications
    fetchNotifications(setNotifications, supabase)
    // Listen for new and deleted notifications
    const notificationsListener = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => handleNewNotification(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications' },
        (payload) => handleUpdateNotification(payload.new)
      )
      .subscribe()


    // Cleanup on unmount
    return () => {
     const channels = supabase.getChannels();
     channels.forEach(channel => {
      if (channel.topic === 'public:notifications' ) {
        console.log("unsubscribe channel", channel)
        channel.unsubscribe();
      }
    });
    }
  }, []);

  // Update when the route changes
  useEffect(() => {
    if (props?.userId > 0) {
      setNotifications([]);
      fetchUserNotifications(props.userId, (notifications) => {
        setNotifications(notifications);
      }, supabase)
      setUserId(props.userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userId])


  // New notification received from Postgres
  useEffect(() => {
    if (newNotification) setNotifications(notifications.concat(newNotification))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newNotification])

  // Updated notification received from Postgres
  useEffect(() => {
    console.log('updateNotification', updateNotification);
    if (updateNotification) {
      const index = notifications.findIndex(rect => rect?.id === updateNotification?.id);
      if (index !== -1) {
        // Object exists in the array, replace it
        setNotifications(notifications.splice(index, 1, updateNotification))
        // console.log('updated', notifications)
      } else {
        // Object does not exist in the array, add it
        setNotifications(notifications.concat(updateNotification))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateNotification])

  // Updated notification received from Postgres
  useEffect(() => {
    if (notifications) {
      setActiveNotifications(notifications.filter((notification) => {
        return !notification?.completed;
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications])


  return {
    // We can export computed values here to map the authors to each message
    notifications: notifications || [],
    activeNotifications: activeNotifications || [],
    userId,
  }
}

/**
 * Fetch all notifications
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchNotifications = async (setState, supabase) => {
  try {
    let { data } = await supabase.from('notifications').select('*').order('created_at');
    if (setState) setState(data)
    return data
  } catch (error) {
    console.error('error', error)
  }
}

/**
 * Fetch a single user
 * @param {number} userId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUserNotifications = async (userId, setState, supabase) => {
  try {
    let { data } = await supabase.from('notifications').select(`*`).eq('user_id', userId)
    if (setState) setState(data)
    return data
  } catch (error) {
    console.error('error', error)
  }
}



/**
 * complete a notification from the display
 * @param {number} notification_id
 */
export const completeNotification = async (notification, supabase) => {
  try {
    notification.completed = true;
    let { data } = await supabase.from('notifications')
          .update(notification).eq('id', notification.id);
    return data
  } catch (error) {
    console.error('error', error)
  }
}

