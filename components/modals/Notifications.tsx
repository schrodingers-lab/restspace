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
} from '@ionic/react';
import Store from '../../store';
import { getNotifications } from '../../store/selectors';

import { close, closeCircleOutline, mailUnread } from 'ionicons/icons';
import React from 'react';
import { completeNotification, useStore } from '../../store/notifications';
import { SupabaseClient, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import ToggleDateDisplay from '../ui/ToggleDatesDisplay';




const Notifications = ({ open, onDidDismiss, history }) => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const {activeNotifications} = useStore({userId: user?.id});

  const doCompleteNotification = async(notification, supabase) => {
    if (notification?.id) {
      const result = await completeNotification(notification, supabase);
    }
    return true;
  }

  const visitNotificationObject = async(notification) => {
    if (notification?.object_type == 'incidents') {
      history.push('/tabs/incidents/' + notification.object_id);
    } else if (notification?.object_type == 'chats') {
      history.push('/tabs/chats/' + notification.object_id);
    } else if (notification?.object_type == 'attached') {
      history.push('/admin/incidents/' + notification.object_id) + '#messages';
    }
    onDidDismiss();
  }

  const NotificationItem =({ notification, supabase }) => {
    if (notification && notification.object_type == 'incidents') {
      return <NotificationIncidentItem notification={notification} supabase={supabase} />
    } else {
      return <NotificationGeneralItem notification={notification} supabase={supabase} />
    }
  };

  const NotificationGeneralItem = ({ notification, supabase }) => (
    <IonItem onClick={(e) => {e.preventDefault(); visitNotificationObject(notification)}}>
      <IonLabel>{notification.message}</IonLabel>
      <IonNote slot="end"><ToggleDateDisplay input_date={notification.created_at} /></IonNote>
      <IonButton slot="end" color="dark" onClick={(e) => {e.preventDefault(); doCompleteNotification(notification, supabase)}}>
        <IonIcon icon={closeCircleOutline} />
      </IonButton>
    </IonItem>
  );  

  const NotificationIncidentItem = ({ notification, supabase }) => (
    <IonItem>
      <IonLabel  onClick={(e) => {e.preventDefault(); visitNotificationObject(notification)}}>Incident {notification.object_id} raised - {notification.message}</IonLabel>
      <IonNote slot="end"><ToggleDateDisplay input_date={notification.created_at} /></IonNote>
      <IonButton slot="end" color="dark" onClick={(e) => {e.preventDefault(); doCompleteNotification(notification, supabase)}}>
        <IonIcon icon={closeCircleOutline} />
      </IonButton>
    </IonItem>
  );  


  return (
    <IonModal isOpen={open} onDidDismiss={onDidDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notifications</IonTitle>
          <IonButton slot="end" color="dark" onClick={onDidDismiss}>
            <IonIcon icon={close}/>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Notifications</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {activeNotifications.map((notification, i) => {
              return <NotificationItem notification={notification} supabase={supabaseClient} key={i} />
            }
          )}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default Notifications;
