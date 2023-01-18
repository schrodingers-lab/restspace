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


const ListDetail = ({ match }) => {
  const {
    params: { incidentId },
  } = match;
  const supabase = useSupabaseClient();
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [error, setError] = useState("");
  const user = useUser();
  const [files, setFiles] = useState([]);


  useEffect(() => {
    const fetchData = async() => {
      // You can await here
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('id', incidentId)
      if(data && data.length > 0){
        setSelectedIncident(data[0]);
     }
    }
    fetchData();
  }, [incidentId]);

  useEffect(() => {
    setIsBookmarked(false);
    const fetchData = async() => {
      // You can await here
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('incident_id', incidentId)
        .eq('user_id', user.id)

      console.log("retrieve bookmark", incidentId, user?.id, data, error)
      if(data && data.length > 0){
        setIsBookmarked(true)
     }
    }
    if (incidentId && user?.id){
      fetchData();
    }
  }, [incidentId, user]);

  useEffect(() => {
    // Only run query once user is logged in.
    const loadData = async () =>{
      setError("");
      if (user?.id){
  
        const { data, error } = await supabase.from('files')
        .select('*')
        .eq('object_type', 'incidents')
        .eq('object_id', ""+incidentId)
        .eq('visible', true);
        
        if(error){
          setError(error.message)
        }else {
          setFiles(data);
        }
      }
    }

    if (user) {
      loadData();
    } else{
      setFiles(undefined);
    }
  }, [user, user?.id, incidentId])

  const toggleBookmark = async() => {
    setError('');
    const removeBookmark = async() => {
      // You can await here
      const { data, error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('incident_id', incidentId)
        .eq('user_id', user.id);

        console.log("remove bookmark", incidentId, user?.id, data, error)
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
        .insert({ incident_id: incidentId, user_id: user.id });

      console.log("create bookmark", incidentId, user?.id, data, error)
      if (error){
        setError(error.message);
      } else {
        setIsBookmarked(true);
      }
      
    }

    if (incidentId && user?.id){
      
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
            <IonBackButton defaultHref="/tabs/incidents" />
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
        
        {selectedIncident && <IncidentDetail incident={selectedIncident}  files={files} />}
      </IonContent>
    </IonPage>
  );
};

export default ListDetail;
