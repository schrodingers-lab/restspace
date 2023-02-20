import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Store } from 'pullstate';
import { useState, useEffect } from 'react'
import { arrayToMap } from '../components/util/data'


export const NotificationStore = new Store({
  notifications: [],
  userId: undefined,
});

/**
 * @param {number} chatId the currently selected Chat
 */
export const useNotificationsStore = (props) => {

  const [userId, setUserId] = useState()
  const notifications = NotificationStore.useState(s => s.notifications);
  const [updateNotification, handleUpdateNotification] = useState(null)
  const [newNotification, handleNewNotification] = useState(null)
  
  
  const supabase = useSupabaseClient();

  // Load initial data and set up listeners
  useEffect(() => {
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
    if (props?.userId?.length > 0) {
      fetchUserNotifications(props.userId, (notifications) => {
        NotificationStore.update(s => {
          s.notifications = notifications;
        });
      }, supabase)
      setUserId(props.userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userId])


  // New notification received from Postgres
  useEffect(() => {
    if (newNotification) {
      NotificationStore.update(s => {
        s.notifications =  s.notifications.concat(newNotification);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newNotification])

  // Updated notification received from Postgres
  useEffect(() => {
    if (updateNotification?.id) {
      const index = notifications.findIndex(rect => rect?.id === updateNotification?.id)
      if (index !== -1) {
        // Object exists in the array, replace it
        const newNotifications = [...notifications]
        newNotifications[index] = updateNotification;
        //Update the store
        NotificationStore.update(s => {
          s.notifications = newNotifications;
        });
      } else {
        // Object does not exist in the array, add it
        NotificationStore.update(s => {
          s.notifications = notifications.concat(updateNotification);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateNotification])

  return {
    userId
  }
}

/**
 * Fetch all notifications
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchNotifications = async (setState, supabase) => {
  try {
    let { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
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
    let { data } = await supabase.from('notifications').select(`*`).eq('user_id', userId).order('created_at', { ascending: false });
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
    const completedNotification = {...notification, completed: true}
    let { data } = await supabase.from('notifications')
          .update(completedNotification).eq('id', notification.id);

    //Update should come back via realtime
    // Notification state is updated in teh realtime

    return data
  } catch (error) {
    console.error('error', error)
  }
}

