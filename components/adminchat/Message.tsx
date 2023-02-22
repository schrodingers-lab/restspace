

import { IonIcon } from '@ionic/react';
import { useUser } from '@supabase/auth-helpers-react'
import { deleteMessage, hideMessage, unhideMessage } from '../../store/chat';
import UserProfileAvatar from '../ui/UserProfileAvatar';
import { eyeOff, eye, trash } from 'ionicons/icons';
import { formatDistanceToNow } from 'date-fns';
import UserProfile from '../modals/UserProfile';
import { useState } from 'react';

export const Message = ({ message, author, supabase }) => {
  if (!message.id) return <></>

    const openUserTab = (userId) => {
        window.open(`/admin/users/${userId}`, "_blank");  
    }
  
  return (
    <div key={message.id} className="flex space-x-3 py-4 bg-gray-400 m-4 p-4 rounded-lg">

        <div className="flex-shrink-0" onClick={()=> openUserTab(message?.user_id)} >
            <UserProfileAvatar userProfile={author} /><br/>
            
        </div>

        <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-800">#{message.id} - {message.text}</p>
            <p className="text-sm text-white">{formatDistanceToNow(new Date(message.inserted_at),{addSuffix: true})}</p>
            <div className="mt-2 flex">
                <span className="inline-flex items-center text-sm">

                    <button  
                        type="button"
                        className="inline-flex space-x-2 text-blue-800 hover:text-blue-500 m-4"
                        onClick={() => deleteMessage(message.id, supabase)}>
                            Delete
                    </button>

                    { message.visible && 
                        <button 
                        type="button"
                        className="inline-flex space-x-2 text-blue-800 hover:text-blue-500 m-4"
                        onClick={() => hideMessage(message.id, supabase)}>
                            Hide
                        </button>
                    }

                    { !message.visible &&  <button 
                        type="button"
                        className="inline-flex space-x-2 text-blue-800 hover:text-blue-500 m-4"
                        onClick={() => unhideMessage(message.id, supabase)}>
                            Unhide
                    </button>}

                </span>
            </div>
        </div>    
    </div>
  )
}

export default Message;