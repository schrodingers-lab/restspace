import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonNote,
    IonLabel,
    IonPage,
  } from '@ionic/react';
  import Store from '../../store';
  import { getNotifications } from '../../store/selectors';
  
  import { close } from 'ionicons/icons';
  import React, { useEffect, useState } from 'react';
  import Chats from '../chat/Chats';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useStore } from '../../store/chat';
import { Chat } from '../chat/Chat';
  

  const ChatDetail = ({ match }) => {
    const {
      params: { chatId },
    } = match;
    
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Messages</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Chat</IonTitle>
            </IonToolbar>
          </IonHeader>
            <Chat chatId={chatId}/>
        </IonContent>
      </IonPage>
    );
  };
  
  export default ChatDetail;
  