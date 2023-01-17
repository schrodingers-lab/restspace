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
  import React from 'react';
  
  const ChatItem = ({ chat }) => (
    <IonItem>
      <IonLabel>{chat.slug}</IonLabel>
      <IonNote slot="end">{chat.inserted_at}</IonNote>
      <IonButton slot="end" fill="clear" color="dark">
        <IonIcon icon={close} />
      </IonButton>
    </IonItem>
  );
  
  const ChatsPage = ({ open, onDidDismiss }) => {
    const notifications = Store.useState(getNotifications);
  
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
              <IonTitle size="large">Chats</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonList>
            {notifications.map((notification, i) => (
              <ChatItem chat={notification} key={i} />
            ))}
          </IonList>
        </IonContent>
      </IonPage>
    );
  };
  
  export default ChatsPage;
  