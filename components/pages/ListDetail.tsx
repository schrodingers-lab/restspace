import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFab,
  IonFabButton,
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
import { create, bookmark, bookmarkOutline } from 'ionicons/icons';
import { useStoreState } from 'pullstate';
import { useUserStore, UserStore } from '../../store/user';
import * as selectors from '../../store/selectors';



const ListDetail = ({ history, match }) => {
  const {
    params: { incidentId },
  } = match;
  const supabase = useSupabaseClient();
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const [isEditor, setIsEditor] = useState(false);
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [error, setError] = useState("");
  const user = useUser();
  const {userIds} = useUserStore({userId: user?.id});
  const authUserProfile = useStoreState(UserStore, selectors.getAuthUserProfile);

  // const {authUserProfile} = useStore({});
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


  useEffect(() => {
  if (user?.id == selectedIncident?.user_id) {
    setIsEditor(true)
  } else {
    if (authUserProfile?.admin) {
      setIsEditor(true)
    }
    setIsEditor(false)
  }
  }, [selectedIncident, user, authUserProfile]);

  const goToEdit = (incidentId) => {
    history.push('/tabs/incident/edit/'+incidentId);
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
            <IonPopover ref={popover} trigger="bookmark" isOpen={popoverOpen} onDidDismiss={() => setPopoverOpen(false)}>
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

        { isEditor && 
          <IonFab horizontal="start" vertical="top" slot="fixed" >
          <IonFabButton
            onClick={() => {
              goToEdit(selectedIncident?.id)
            }}
            size="small"
            color={"medium"}
          >
            <IonIcon icon={create} />
          </IonFabButton>
        </IonFab>
        }
          
          {selectedIncident && <IncidentDetail incident={selectedIncident}  files={files} supabase={supabase}/>}
          
      </IonContent>
    </IonPage>
  );
};

export default ListDetail;
