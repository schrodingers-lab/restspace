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
  IonPopover,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import React, { useRef, useEffect, useState } from 'react';
import RestAreaDetail from '../cards/RestAreaDetail';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { notificationsOutline } from 'ionicons/icons';

import { search, filter, bookmark, bookmarkOutline } from 'ionicons/icons';
import { setErrorHandler } from 'ionicons/dist/types/stencil-public-runtime';
import NoUserCard from '../cards/NoUserCard';

// Create a single supabase client for interacting with your database 
// const supabase = createClient('https://arvqjbylexvdpyooykji.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydnFqYnlsZXh2ZHB5b295a2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMxMTk1MzUsImV4cCI6MTk2ODY5NTUzNX0.09341SKltY0PCODodzrDD1RQDXB5tA5dnMc-jQbKPag');

const ListDetail = ({ match }) => {
  const {
    params: { listId },
  } = match;
  const supabase = useSupabaseClient();
  const [selectedRestArea, setSelectedRestArea] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [error, setError] = useState("");
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
        .eq('user_id', user.id)

      console.log("retrieve bookmark", listId, user?.id, data, error)
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

  const toggleBookmark = async() => {
    setError('');
    const removeBookmark = async() => {
      // You can await here
      const { data, error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('rest_area_id', listId)
        .eq('user_id', user.id);

        console.log("remove bookmark", listId, user?.id, data, error)
        if (error){
          setError(error.message);
        } else {
          setIsBookmarked(false);
        }
    };
    const createBookmark = async() => {
      // You can await here
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({ rest_area_id: listId, user_id: user.id });

      console.log("create bookmark", listId, user?.id, data, error)
      if (error){
        setError(error.message);
      } else {
        setIsBookmarked(true);
      }
      
    }

    if (listId && user?.id){
      
      if (isBookmarked){
        await removeBookmark();
      } else 
        await createBookmark();
    } else {
      setPopoverOpen(true);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/map" />
          </IonButtons>
          <IonTitle>New</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">New</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="flex items-center justify-between text-red-500">
          {error}
        </div>
        
        {(!user ) && <NoUserCard/>}

        { user && 
          <div>
            TODO new form
          </div>
        }
      </IonContent>
    </IonPage>
  );
};

export default ListDetail;
