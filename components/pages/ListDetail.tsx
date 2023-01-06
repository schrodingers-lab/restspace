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
import IncidentDetail from '../cards/IncidentDetail';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { notificationsOutline } from 'ionicons/icons';

import { search, filter, bookmark, bookmarkOutline } from 'ionicons/icons';
import { setErrorHandler } from 'ionicons/dist/types/stencil-public-runtime';

// Create a single supabase client for interacting with your database 
// const supabase = createClient('https://raxdwowfheboqizcxlur.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJheGR3b3dmaGVib3FpemN4bHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI4OTgyNjEsImV4cCI6MTk4ODQ3NDI2MX0.uXdXBjH92OIJgIidgvP-iRHCNW3clm2D7fWVniCX5dg');

const ListDetail = ({ match }) => {
  const {
    params: { listId },
  } = match;
  const supabase = useSupabaseClient();
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [error, setError] = useState("");
  const user = useUser();


  useEffect(() => {
    const fetchData = async() => {
      // You can await here
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('id', listId)
      if(data && data.length > 0){
        setSelectedIncident(data[0]);
     }
    }
    fetchData();
  }, [listId]);

  useEffect(() => {
    setIsBookmarked(false);
    const fetchData = async() => {
      // You can await here
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('incident_id', listId)
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

  // useEffect(() => {
  //   selectedIncident
  // }, [selectedIncident])

  const toggleBookmark = async() => {
    setError('');
    const removeBookmark = async() => {
      // You can await here
      const { data, error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('incident_id', listId)
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

      const {
        data: { session },
      } = await supabase.auth.getSession()
      console.log("session",session)

      const { data, error } = await supabase
        .from('bookmarks')
        .insert({ incident_id: listId, user_id: user.id });

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
            <IonBackButton defaultHref="/tabs/lists" />
          </IonButtons>
          <IonTitle>#{selectedIncident?.id} - {selectedIncident?.name}</IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={() => toggleBookmark()}>
              {isBookmarked && <IonIcon icon={bookmark} />}
              {!isBookmarked && <IonIcon icon={bookmarkOutline} />}
            </IonButton>
            <IonPopover ref={popover} isOpen={popoverOpen} onDidDismiss={() => setPopoverOpen(false)}>
              <IonContent class="ion-padding">login or sign up for free to access this feature</IonContent>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{selectedIncident?.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="flex items-center justify-between text-red-500">
          {error}
        </div>
        
        {selectedIncident && <IncidentDetail incident={selectedIncident} />}
      </IonContent>
    </IonPage>
  );
};

export default ListDetail;
