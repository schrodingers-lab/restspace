
import { useRouter } from 'next/router'

import { useContext, useEffect, useRef, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { addMessage, useStore } from '../../../store/chat'
import Layout from '../../../components/adminchat/Layout'
import Message from '../../../components/adminchat/Message'
import MessageInput from '../../../components/adminchat/MessageInput'
import { handleClientScriptLoad } from 'next/script'

const ChatsPage = (props) => {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();

  const messagesEndRef = useRef(null)

  // Else load up the page
  const { id: chatId } = router.query
  const { messages, chats } = useStore({ chatId })
  const [activeChat, setActiveChat] = useState<any>();

  // useEffect(() => {
  //   messagesEndRef.current.scrollIntoView({
  //     block: 'start',
  //     behavior: 'smooth',
  //   })
  // }, [messages])

  // redirect to public chat when current chat is deleted
  useEffect(() => {
    if (!chats || chats.length == 0) return;
    
    if (!chats.some((chat) => chat.id === Number(chatId))) {
      router.push('/admin/chats/1')
    }
    chats.forEach(chat => {
      if (chat.id === Number(chatId)){
        setActiveChat(chat);
      }
    })
  }, [chats, chatId]);

  const viewIncident = (incidentId) => {
    router.push('/tabs/lists/'+incidentId);
  }
  
  // Render the chats and messages
  return (
    <Layout chats={chats} activeChatId={chatId}>
      <div className="relative h-screen">
        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Chat #{chatId} - {activeChat?.slug} </h3>
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              { activeChat && activeChat.object_type == 'incidents' &&
                <button
                  type="button"
                  onClick={() => viewIncident(activeChat.object_id)}
                  className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  View Incident
                </button>
              }
            </div>
          </div>
        </div>
        <div className="messages h-full pb-24 overflow-y-scroll">
          <div className="p-2 h-auto ">
            {messages.map((x) => (
              <Message key={x.id} message={x} supabase={supabase}/>
            ))}
            <div ref={messagesEndRef} style={{ height: 0 }} />
          </div>
        </div>
        <div className="p-2 h-18  absolute bottom-0 left-0 w-full">
          <MessageInput onSubmit={async (text) => addMessage(text, chatId, user.id, supabase)} />
        </div>
      </div>
    </Layout>
  )
}

export default ChatsPage