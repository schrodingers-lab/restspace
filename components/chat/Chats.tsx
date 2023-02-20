import { IonItem } from "@ionic/react";
import { useStore } from "../../store/chat";


  const ChatItem = ({ chat }) => (
    <IonItem key={chat.id} className="py-4" routerLink={'/tabs/chats/'+chat.id} routerDirection="none" detail={false} lines="none">
    <div className="flex space-x-3">
     
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium"> #{chat.id} - {chat.slug}</h3>
          <p className="text-sm text-gray-500">{chat.time}</p>
        </div>
        
        {chat.object_id && <p className="text-sm text-gray-500">
          Incident #{chat.object_id}
        </p>}

        {/* <div className="flex -space-x-2 overflow-hidden">
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
          </div> */}
      </div>
    </div>
  </IonItem>
  );
  
  
  export default function Chats() {

    const { publicChats } = useStore({})
    
    return (
      <div>

        <label className="block text-sm px-6 font-medium text-gray-700 dark:text-white"  key="public-channel-label">
          Public Channels
        </label>
  
        <ul role="list" className="divide-y divide-gray-200">
          {publicChats.map((chatItem) => (
            <ChatItem chat={chatItem} key={chatItem.id} />
          ))}
        </ul>

        <hr></hr>

        <label className="block text-sm px-6 font-medium text-gray-700 dark:text-white"  key="member-channel-label">
          Your Incident Channels
        </label>
  
        <ul role="list" className="divide-y divide-gray-200">
          {publicChats.map((chatItem) => (
            <ChatItem chat={chatItem} key={chatItem.id} />
          ))}
        </ul>
      </div>
    )
  }
  