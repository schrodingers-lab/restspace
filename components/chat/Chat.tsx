import { useEffect, useRef } from "react";
import { useStore } from "../../store/chat";
import Message from "./Message";
import MessageInput from "./MessageInput";

export const Chat = ({ chatId }) => {
  const { messages } = useStore({ chatId });

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
      {chatId && 
        <>
          <ul>
            {messages && messages.length > 0 && messages.map((message) => <Message message={message} key={message.id} />)}
            {messages && messages.length == 0 && <div>No messages yet</div>}
            <div ref={messagesEndRef} />
          </ul>
          <MessageInput chatId={chatId} />
        </>
      }

    </>
	)
}