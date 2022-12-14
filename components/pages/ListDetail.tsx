import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import React, { useRef, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import RestAreaDetail from '../cards/RestAreaDetail';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { notificationsOutline } from 'ionicons/icons';

import { search, filter, bookmark, bookmarkOutline } from 'ionicons/icons';

// Create a single supabase client for interacting with your database 
// const supabase = createClient('https://arvqjbylexvdpyooykji.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydnFqYnlsZXh2ZHB5b295a2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMxMTk1MzUsImV4cCI6MTk2ODY5NTUzNX0.09341SKltY0PCODodzrDD1RQDXB5tA5dnMc-jQbKPag');

const ListDetail = ({ match }) => {
  const {
    params: { listId },
  } = match;
  const supabase = useSupabaseClient();
  const [selectedRestArea, setSelectedRestArea] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const user = useUser();
  useEffect(() => {
 
    const fetchData = async() => {
      // You can await here
      const { data, error } = await supabase
        .from('rest_areas')
        .select('*')
        .eq('id', listId)
      if(data && data.length > 0){
        setSelectedRestArea(data[0]);
     }
    }
    fetchData();
  }, [listId]);

  useEffect(() => {
    const fetchData = async() => {
      // You can await here
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('rest_area_id', listId)
        .eq('user', user.id)
      if(data && data.length > 0){
        setIsBookmarked(true)
     }
    }
    if (listId && user?.id){
      fetchData();
    }
  }, [listId, user]);

  useEffect(() => {
    selectedRestArea
  }, [selectedRestArea])

  const toggleBookmark = () => {
    const removeBookmark = async() => {
      // You can await here
      const { data, error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('rest_area_id', listId)
        .eq('user', user.id);
      setIsBookmarked(false);
    };
    const createBookmark = async() => {
      // You can await here
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({ rest_area_id: listId, user_id: user.id });
      setIsBookmarked(true);
    }

    if (listId && user?.id){
      if (isBookmarked){
        removeBookmark();
      } else 
        createBookmark();
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/lists" />
          </IonButtons>
          <IonTitle>#{selectedRestArea?.id} - {selectedRestArea?.name}</IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={() => toggleBookmark()}>
              {isBookmarked && <IonIcon icon={bookmark} />}
              {!isBookmarked && <IonIcon icon={bookmarkOutline} />}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{selectedRestArea?.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {selectedRestArea && <RestAreaDetail restarea={selectedRestArea} />}
      </IonContent>
    </IonPage>
  );
};

export default ListDetail;
