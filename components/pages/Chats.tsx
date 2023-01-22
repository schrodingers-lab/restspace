import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButtons,
    IonMenuButton,
  } from '@ionic/react';
 
  import React from 'react';
  import Chats from '../chat/Chats';
  

  const ChatsPage = () => {


    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Chats</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Chats</IonTitle>
            </IonToolbar>
          </IonHeader>
            <Chats/>
        </IonContent>
      </IonPage>
    );
  };
  
  export default ChatsPage;
  