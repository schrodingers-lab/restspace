

import { IonIcon } from '@ionic/react';
import { useUser } from '@supabase/auth-helpers-react'
import UserProfileAvatar from '../ui/UserProfileAvatar';
import { eyeOff, eye, trash } from 'ionicons/icons';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import UserProfile from '../modals/UserProfile';
import { FabUgcMessageActions } from '../cards/FabUgcMessageActions';

export const Message = ({ message }) => {
  const user = useUser();
  const [open, setOpen] = useState(false)

  if (!message.id) return <></>

  const isMyMessage = () => {
    return user?.id == message?.user_id
  }
  const bgColor = isMyMessage ? 'bg-green-500': 'bg-yellow-500';

  const toggleUserModal = () => {
    setOpen(!open);
  }

  const onDidDismiss = () => {
    console.log('dismiss modal')
  }
  
  return (
    <div key={message.id} className={`flex space-x-3 py-4 mt-4 mb-4 p-4 rounded-xl ${bgColor} relative`}>
        {!isMyMessage && 
          <FabUgcMessageActions message={message} creator={message?.author}  />
        }
        <div className="flex-shrink-0" onClick={toggleUserModal}>
            <UserProfileAvatar userProfile={message?.author} /><br/>
            <UserProfile open={open} onDidDismiss={onDidDismiss} userProfile={message?.author} />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-800">{message.text}</p>
            <p className="text-sm text-white pt-2">{formatDistanceToNow(new Date(message.inserted_at),{addSuffix: true})}</p>
        </div>    
        
    
    </div>
  )
}

export default Message;