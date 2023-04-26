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
import { completeNotification, completeUserNotifications, NotificationStore } from '../../store/notifications';
import {  UserStore, useUserStore } from '../../store/user';
import { SupabaseClient, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import ToggleDateDisplay from '../ui/ToggleDatesDisplay';
import NotificationChatItem from '../notifications/NotificationChatItem';
import NotificationIncidentItem from '../notifications/NotificationIncidentItem';
import { useStoreState } from 'pullstate';
import * as selectors from '../../store/selectors';



const Notifications = ({ open, onDidDismiss, history }) => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const {userIds} = useUserStore({userId: user?.id});
  const authUserProfile = useStoreState(UserStore, selectors.getAuthUserProfile);
  const activeNotifications = useStoreState(NotificationStore, selectors.getActiveNotifications);


  const doCompleteNotification = async(notification, supabase) => {
    if (notification?.id) {
      const result = await completeNotification(notification, supabase);
    }
    return true;
  }

  const doCompleteAllNotifications = async(user_id, supabase) => {
    if (user_id) {
      const result = await completeUserNotifications(user_id, supabase);
    }
    return true;
  }

  const visitNotificationObject = async(notification) => {
    if (notification?.object_type == 'incidents') {
      history.push('/tabs/incidents/' + notification.object_id);
    } else if (notification?.object_type == 'chats') {
      history.push('/tabs/chats/' + notification.object_id);
    } else if (notification?.object_type == 'messages') {
      history.push('/tabs/chats/' + notification.object_id);
    } else if (notification?.object_type == 'attached') {
      history.push('/admin/incidents/' + notification.object_id) + '#messages';
    }
    onDidDismiss();
  }

  const NotificationItem =({ notification, supabase, itemKey}) => {
    if (notification && notification.object_type == 'incidents') {
      return <NotificationIncidentItem
              notification={notification} 
              supabase={supabase} 
              itemKey={itemKey} 
              history={history} 
              doCompleteNotification={doCompleteNotification} 
              onDidDismiss={onDidDismiss} />
    } else if (notification && notification.object_type == 'chats') {
      return <NotificationChatItem 
              notification={notification} 
              supabase={supabase} 
              itemKey={itemKey} 
              history={history} 
              doCompleteNotification={doCompleteNotification} 
              onDidDismiss={onDidDismiss} />
    } else {
      return <NotificationGeneralItem notification={notification} supabase={supabase} itemKey={itemKey}/>
    }
  };

  const NotificationGeneralItem = ({ notification, supabase, itemKey }) => (
    <IonItem onClick={(e) => {e.preventDefault(); visitNotificationObject(notification)}} key={itemKey}>
      <IonLabel>{notification.message}</IonLabel>
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
          <IonButton slot="end" color="dark" onClick={(e) => {e.preventDefault(); doCompleteAllNotifications(user?.id, supabaseClient)}}>
            Mark All Read
          </IonButton>
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
                <div key={i}>
                  {notification.completed == false && 
                    <NotificationItem notification={notification} supabase={supabaseClient} itemKey={"NotificationItem-"+i} />
                  }
                </div>
              )
            }
          )}

          {(activeNotifications && activeNotifications.length == 0) && 
            <div className="text-center" key="active-empty">
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
