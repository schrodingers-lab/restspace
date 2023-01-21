import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'

/**
 * @param {number} chatId the currently selected Chat
 */
export const useStore = (props) => {
  const [chats, setChats] = useState([])
  const [publicChats, setPublicChats] = useState([])
  const [messages, setMessages] = useState([])
  const [userIds, setUserIds] = useState([])
  const [userProfiles, setUserProfiles] = useState(new Map())
  const [newMessage, handleNewMessage] = useState(null)
  const [newChat, handleNewChat] = useState(null)
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState(null)
  const [deletedChat, handleDeletedChat] = useState(null)
  const [deletedMessage, handleDeletedMessage] = useState(null)

  const supabase = useSupabaseClient();

  // Load initial data and set up listeners
  useEffect(() => {
    // Get Chats
    fetchChats(setChats, supabase)
    // Listen for new and deleted messages
    const messageListener = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => handleNewMessage(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (payload) => handleDeletedMessage(payload.old)
      )
      .subscribe()

    // Listen for new and deleted chats
    const chatListener = supabase
      .channel('public:chats')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chats' },
        (payload) => handleNewChat(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'chats' },
        (payload) => handleDeletedChat(payload.old)
      )
      .subscribe()
    // Cleanup on unmount
    return () => {
    //  // const channels = supabase.getChannels()
    //   supabase.removeChannel('public:messages')
    //   supabase.removeChannel('public:chats')
      supabase.removeAllChannels()
    }
  }, []);

  // Update when the route changes
  useEffect(() => {
    if (chats) {
      setPublicChats(chats.filter(chat => chat.public == true))
    } else{
      setPublicChats([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats])

  // Update when the route changes
  useEffect(() => {
    if (props?.chatId > 0) {
      fetchMessages(props.chatId, (messages) => {
        setMessages(messages);
        const userIds = messages.map(message => message.user_id);
        if(userIds?.length > 0){
            setUserIds(Array.from(new Set(userIds)));
        } else {
            setUserIds([]);
        }
      }, supabase)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.chatId])

  // New message received from Postgres
  useEffect(() => {
    if (newMessage && newMessage.chat_id === Number(props.chatId)) {
      const handleAsync = async () => {
        let authorId = newMessage.user_id
        if (!userIds.includes(authorId)) await fetchUser(authorId, (user) => handleNewOrUpdatedUser(user), supabase)
        setMessages(messages.concat(newMessage))
      }
      handleAsync()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage])

  // Deleted message received from postgres
  useEffect(() => {
    if (deletedMessage) setMessages(messages.filter((message) => message.id !== deletedMessage.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedMessage])

  // New chat received from Postgres
  useEffect(() => {
    if (newChat) setChats(chats.concat(newChat))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChat])

  // Deleted chat received from postgres
  useEffect(() => {
    if (deletedChat) setChats(chats.filter((chat) => chat.id !== deletedChat.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedChat])

  // New or updated user received from Postgres
  useEffect(() => {
    if (newOrUpdatedUser) {
        if (!userIds.includes(newOrUpdatedUser.id)){
            setUserIds(existing => [...existing, newOrUpdatedUser.id]);
            userProfiles.set(newOrUpdatedUser.id, newOrUpdatedUser);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newOrUpdatedUser]);

  // load the user profiles
  const arrayToMap = (array: any[], key: string) => {
    return array.reduce((map, obj) => {
        map.set(obj[key], obj);
        return map;
    }, new Map());
  }

  useEffect( () => {
    const handleAsync = async () => {
      return await fetchUsers(userIds, (users) => setUserProfiles(arrayToMap(users,'id')), supabase);
    }
    if (userIds && userIds.length > 0){
      handleAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIds])

  
  return {
    // We can export computed values here to map the authors to each message
    messages: messages.map((x) => ({ ...x, author: userProfiles?.get(x?.user_id) })),
    chats: chats !== null ? chats.sort((a, b) => a.slug.localeCompare(b.slug)) : [],
    userIds,
    publicChats,
  }
}

/**
 * Fetch all chats
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchChats = async (setState, supabase) => {
  try {
    let { data } = await supabase.from('chats').select('*').order('inserted_at');
    if (setState) setState(data)
    return data
  } catch (error) {
    console.log('error', error)
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
 * Fetch all messages and their authors
 * @param {number} chatId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchMessages = async (chatId, setState, supabase) => {
  try {
    let { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('inserted_at')
    if (setState) setState(data)
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Insert a new chat into the DB
 * @param {string} slug The chat name
 * @param {number} user_id The chat creator
 */
export const addChat = async (slug, user_id, isPublic, visible, supabase) => {
  try {
    let { data } = await supabase.from('chats').insert([{ slug, user_id, public: isPublic, visible }]).select()
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Insert a new message into the DB
 * @param {string} message The message text
 * @param {number} chat_id
 * @param {number} user_id The author
 */
export const addMessage = async (text, chat_id, user_id, supabase) => {
  try {
    let { data } = await supabase.from('messages').insert([{ text, chat_id, user_id }]).select()
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Delete a chat from the DB
 * @param {number} chat_id
 */
export const deleteChat = async (chat_id, supabase) => {
  try {
    let { data } = await supabase.from('chats').delete().match({ id: chat_id })
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Delete a message from the DB
 * @param {number} message_id
 */
export const deleteMessage = async (message_id, supabase) => {
  try {
    let { data } = await supabase.from('messages').delete().match({ id: message_id })
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * hide a message from the display
 * @param {number} message_id
 */
export const hideMessage = async (message_id, supabase) => {
    try {
      let { data } = await supabase.from('messages')
            .update({visible: false} ).eq('id', message_id);
      return data
    } catch (error) {
      console.log('error', error)
    }
  }

/**
 * unhide a message from the display
 * @param {number} message_id
 */
  export const unhideMessage = async (message_id, supabase) => {
    try {
      let { data } = await supabase.from('messages')
            .update({visible: true} ).eq('id', message_id);
      return data
    } catch (error) {
      console.log('error', error)
    }
  }