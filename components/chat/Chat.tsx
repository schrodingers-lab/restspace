import { IonTitle } from "@ionic/react";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useRef } from "react";
import NoUserCard from "../cards/NoUserCard";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { NotificationStore, useNotificationsStore } from '../../store/notifications';
import { useStoreState } from 'pullstate';
import * as selectors from '../../store/selectors';
import { useChatStore, ChatStore } from "../../store/chat";

export const Chat = ({ chatId }) => {

  const user = useUser();
  const {userId} = useNotificationsStore({userId: user?.id});
  const {userIds} = useChatStore({chatId: chatId});
  const activeNotifications = useStoreState(NotificationStore, selectors.getActiveNotifications);
  const messages = useStoreState(ChatStore, selectors.getMessages);
  const authors = useStoreState(ChatStore, selectors.getAuthors);

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
        <IonTitle size="large">No Messages</IonTitle> 
      }
      {chatId && !user &&
        <div className="mx-2">
          <NoUserCard  />
        </div>
      }
      {chatId && user &&
        <div className="mx-2">
          <ul>
            {messages && messages.length > 0 && messages.map((message) => <Message message={message} author={authors?.get(message?.user_id)} key={message.id} />)}
            {messages && messages.length == 0 && 
              <div className="flex items-center justify-center border-dotted border-2 m-4 pb-2 rounded-md">
                <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-200">Start the Conversation</span>
              </div>
            }
            <div ref={messagesEndRef} />
          </ul>
          {user && <MessageInput chatId={chatId} />}
        </div>
      }

    </>
	)
}
