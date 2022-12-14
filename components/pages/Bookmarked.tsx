import RestAreaCard from '../cards/RestAreaCard';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonMenuButton,
} from '@ionic/react';
import Notifications from './Notifications';
import { useEffect, useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { getRestAreas } from '../../store/selectors';
import Store from '../../store';
import React from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

const Bookmarked = () => {
  const restAreas = Store.useState(getRestAreas);
  const [showNotifications, setShowNotifications] = useState(false);

  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [data, setData] = useState<any>();

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from('bookmarks').select('*').eq('user_id', user?.id);
      setData(data);
    }
    // Only run query once user is logged in.
    if (user) loadData()
  }, [user])

  // console.log("restAreas", restAreas);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bookmarked</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={notificationsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Bookmarked</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Notifications open={showNotifications} onDidDismiss={() => setShowNotifications(false)} />
        {restAreas.map((i, index) => (
          <RestAreaCard {...i} key={index} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Bookmarked;
