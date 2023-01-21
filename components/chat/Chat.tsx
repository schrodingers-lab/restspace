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
      <ul>
        {messages && messages.map((message) => <Message message={message} key={message.id} />)}
        <div ref={messagesEndRef} />
      </ul>
      <MessageInput chatId={chatId} />
    </>
	)
}