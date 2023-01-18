import { useStore } from "../../store/chat";


  const ChatItem = ({ chat }) => (
    <li key={chat.id} className="py-4">
    <div className="flex space-x-3">
     
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{chat.slug}</h3>
          <p className="text-sm text-gray-500">{chat.time}</p>
        </div>
        <p className="text-sm text-gray-500">
          Incident #{chat.object_id}
        </p>
        <div className="flex -space-x-2 overflow-hidden">
          <img
            className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <img
            className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <img
            className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
            alt=""
          />
          <img
            className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          </div>
      </div>
    </div>
  </li>
  );
  
  
  export default function Chats() {

    const { chats } = useStore({})

    return (
      <div>
        <ul role="list" className="divide-y divide-gray-200">
          {chats.map((chatItem) => (
            <ChatItem chat={chatItem} key={chatItem.id} />
          ))}
        </ul>
      </div>
    )
  }
  