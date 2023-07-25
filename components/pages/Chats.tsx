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
  import { useUser } from '@supabase/auth-helpers-react';
  import NoUserCard from '../cards/NoUserCard';
  

  const ChatsPage = () => {
    const authUser = useUser();

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Messages</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Messages</IonTitle>
            </IonToolbar>
          </IonHeader>
          { !authUser &&
            <div className="mx-2">
              <NoUserCard  />
            </div>
        }

        {authUser && 
            <Chats/>
        }
        </IonContent>
      </IonPage>
    );
  };
  
  export default ChatsPage;
  