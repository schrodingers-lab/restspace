import { IonItem } from "@ionic/react";
import { NotificationStore, useNotificationsStore } from '../../store/notifications';
import { useStoreState } from 'pullstate';
import * as selectors from '../../store/selectors';
import { ChatStore, useChatStore } from "../../store/chat";
import { useUser } from "@supabase/auth-helpers-react";

  const ChatItem = ({ chat, chaturl='/tabs/chats/' }) => (
    <IonItem key={chat.id} className="py-4" routerLink={chaturl} routerDirection="none" detail={false} lines="none">
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
    const user = useUser();
    const {userId} = useNotificationsStore({userId: user?.id});
    const {userIds} = useChatStore({userId: user?.id});
    const activeNotifications = useStoreState(NotificationStore, selectors.getActiveNotifications);
    const publicChats = useStoreState(ChatStore, selectors.getPublicChats);
    const membershipChats = useStoreState(ChatStore, selectors.getMembershipChats);
    
    return (
      <div className="max-w-xl my-4 mx-auto">

        <label className="block text-sm px-6 font-medium text-gray-700 dark:text-white"  key="public-channel-label">
          Public Channels
        </label>
  
        <ul role="list" className="divide-y divide-gray-200">
          {publicChats.map((chatItem) => (
            <ChatItem chat={chatItem} chaturl={'/tabs/chats/'+chatItem?.id} key={chatItem.id}  />
          ))}
        </ul>

        <br/>
        <br/>

        <label className="block text-sm px-6 font-medium text-gray-700 dark:text-white"  key="member-channel-label">
          Your Incident Channels
        </label>
  
        <ul role="list" className="divide-y divide-gray-200">
          {membershipChats.map((chatItem) => (
            <ChatItem chat={chatItem} chaturl={'/tabs/incidents/'+chatItem?.object_id} key={"mc"+chatItem.id} />
          ))}
        </ul>
      </div>
    )
  }
  