import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButtons,
    IonBackButton,
  } from '@ionic/react';

  import React from 'react';
  import { Chat } from '../chat/Chat';
  

  const ChatDetail = ({ match }) => {
    const {
      params: { chatId },
    } = match;
    
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/chats" />
            </IonButtons>
            <IonTitle>Messages - Chat #{chatId}</IonTitle>
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
  