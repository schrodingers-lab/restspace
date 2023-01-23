import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useRef } from "react";
import { useStore } from "../../store/chat";
import NoUserCard from "../cards/NoUserCard";
import Message from "./Message";
import MessageInput from "./MessageInput";

export const Chat = ({ chatId }) => {
  const { messages } = useStore({ chatId });
  const user = useUser();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

	return (
    <>
      {chatId == undefined && 
        <div> No Messages</div>
      }
      {chatId && !user &&
        <NoUserCard/>
      }
      {chatId && user &&
        <>
          <ul>
            {messages && messages.length > 0 && messages.map((message) => <Message message={message} key={message.id} />)}
            {messages && messages.length == 0 && 
              <div className="flex items-center justify-center border-dotted border-2 m-4 pb-2 rounded-md">
                <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-200">Start the Conversation</span>
              </div>
            }
            <div ref={messagesEndRef} />
          </ul>
          {user && <MessageInput chatId={chatId} />}
        </>
      }

    </>
	)
}
