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

import { close, closeCircleOutline, mailUnread } from 'ionicons/icons';
import React from 'react';
import { completeNotification, useStore } from '../../store/notifications';
import {  useStore as useUserStore } from '../../store/user';
import { SupabaseClient, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import ToggleDateDisplay from '../ui/ToggleDatesDisplay';




const Notifications = ({ open, onDidDismiss, history }) => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const {activeNotifications} = useStore({userId: user?.id});
  const { authUserProfile } = useUserStore({})

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
              return (
                <>
                  {notification.completed == false && 
                    <NotificationItem notification={notification} supabase={supabaseClient} key={i} />
                  }
                </>
              )
            }
          )}

          {(activeNotifications && activeNotifications.length == 0) && 
            <div className="text-center">
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No Notifications</h3>
              {authUserProfile && !authUserProfile.longitude &&
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Ensure you have your location set on your Profile.</p>
              }

              {authUserProfile && authUserProfile.longitude &&
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">No notifications for your area.</p>
              }
            </div>
          }
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default Notifications;
