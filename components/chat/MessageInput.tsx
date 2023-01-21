import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Fragment, useRef, useState } from 'react'
import { addMessage } from '../../store/chat';
import { useStore } from '../../store/user';
import UserProfileAvatar from '../ui/UserProfileAvatar';



export default function MessageInput({chatId}) {
  
  const {authUser } = useStore({});
  const [messageText, setMessageText] = useState('')
  const supabase = useSupabaseClient();
  const messageTextArea = useRef<HTMLTextAreaElement>(null);

  const sendMessage = () => {
    if(messageText && messageText.length > 0) {
      addMessage(messageText,chatId, authUser?.id, supabase)
      setMessageText('');
      if (messageTextArea.current){
        // debugger;
        messageTextArea.current.innerText = undefined;
      }
    }
  }
  
  const submitOnEnter = (event) => {
    // Watch for enter key
    if (event.keyCode === 13) {
      event.preventDefault();
      sendMessage();
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  }

  return (
    <div className="flex items-start space-x-4 mx-2 py-4">
      <div className="min-w-0 flex-1">
        <form action="#" className="relative" onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <label htmlFor="message" className="sr-only">
              Add your message
            </label>
            <textarea
              rows={2}
              name="message"
              id="message"
              ref={messageTextArea}
              className="block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm"
              placeholder="Add your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => submitOnEnter(e)}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5">
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
