import IncidentCard from '../cards/IncidentCard';
import {  Route } from 'react-router-dom';
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
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonBadge,
} from '@ionic/react';
import Notifications from '../modals/Notifications';
import { useEffect, useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { getIncidents } from '../../store/selectors';
import Store from '../../store';
import React from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import NoUserCard from '../cards/NoUserCard';
import { ErrorCard } from '../cards/ErrorCard';
import { useStore } from '../../store/notifications';

const Bookmarked = ({history}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const [error, setError] = useState("");
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  const {activeNotifications} = useStore({userId: user?.id});
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);



  useEffect(() => {
    // Only run query once user is logged in.
    const loadData = async () =>{

      setError("");
      setLoading(true);
  
      if (user?.id){
        const { data, error } = await supabaseClient.from('incidents')
        .select('*, bookmarks!inner(*)')
        .eq('bookmarks.user_id', user?.id)
        .eq('visible', true)
        .order('inserted_at', {ascending: false})
        if(error){
          setError(error.message)
        }else {
          setData(data);
        }
      }
  
      setLoading(false);
      
      console.log('load bookmarked incidents', data, error);
    }

    if (user) {
      loadData();
    } else{
      setData(undefined);
    }
  }, [user, user?.id, supabaseClient])



  const goToIncident = (incident) => {
    if (incident && incident.id){
      history.push('/tabs/incidents/'+incident?.id);
    }
  }

  const handleRefresh = async(event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(async () => {
      // Any calls to load data go here
      const loadData = async () =>{

        setError("");
        setLoading(true);
    
        if (user?.id){
          const { data, error } = await supabaseClient.from('incidents')
          .select('*, bookmarks!inner(*)')
          .eq('bookmarks.user_id', user?.id)
          
          if(error){
            setError(error.message)
          }else {
            setData(data);
          }
        }
    
        setLoading(false);
        
        console.log('load bookmarked incidents', data, error);
      }

      await loadData();
      event.detail.complete();
    }, 2000);
  }

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
              {activeNotifications.length > 0 && 
                <IonBadge color="primary">{activeNotifications.length}</IonBadge>
              }
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Bookmarks</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Notifications open={showNotifications} history={history} onDidDismiss={() => setShowNotifications(false)} />

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="flex items-center">
          <div className="rounded-md bg-gray-50 dark:bg-gray-900 p-4 w-full">
            <div className="flex w-full justify-between">
              <p className="text-sm text-gray-500 w-fill">Pull this down to trigger a refresh.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {error && 
            <ErrorCard errorMessage={error}/>
          }
        </div>


        {data && data.map((i, index) => (
          <IncidentCard key={index} onClickFnc={goToIncident} incident={i} />
        ))}

        {(data && data.length == 0) && 
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookmarks</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new bookmark on an incident.</p>
          </div>
        }


        
       {(!user && !loading) && <NoUserCard/>}
            
      </IonContent>
    </IonPage>
  );
};

export default Bookmarked;
