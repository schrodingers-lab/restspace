import {
    IonPage,
    IonHeader,
    IonItem,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonToggle,
    IonLabel,
    IonCard,
    IonCardContent,
    IonButtons,
    IonMenuButton,
    IonBadge,
    IonButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    RefresherEventDetail,
  } from '@ionic/react';
  
  import Store from '../../store';
  import * as selectors from '../../store/selectors';
  import { setSettings } from '../../store/actions';
  import React, { use, useState } from 'react';
  import { useStore } from '../../store/user';
  import { useStore as useNotificationsStore } from '../../store/notifications';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import distance from '@turf/distance';
import { addHours } from 'date-fns';
import { dateString } from '../util/dates';
import { useEffect } from 'react';
import IncidentCard from '../cards/IncidentCard';
import IncidentCardMini from '../cards/IncidentCardMini';
import { ageInHours, localIncidentDistance } from '../util/mapbox';
import { getPagination } from '../util/data';
import { fetchUserIncidents, fetchUserIncidentsPages, geoTimedSearchPaged } from '../../store/incident';
import Card from '../ui/Card';
import NoUserCard from '../cards/NoUserCard';
import { notificationsOutline } from 'ionicons/icons';
import Notifications from '../modals/Notifications';
  
  const Home = ({history}) => {
    const settings = Store.useState(selectors.getSettings);
    const [showNotifications, setShowNotifications] = useState(false);

    const [localIncidents, setLocalIncidents] = useState([]);
    const [myIncidents, setMyIncidents] = useState([]);

    const [loading, setLoading] = useState<boolean>(false);
    const supabase = useSupabaseClient();
    const user = useUser();
    const {authUserProfile} = useStore({});
    const {activeNotifications} = useNotificationsStore({userId: user?.id});


    const goToIncident = (incident) => {
      if (incident && incident.id){
        history.push('/tabs/incidents/'+incident?.id);
      }
    }

    const loadUserData = async () => {
   
      setLoading(true);
      setLocalIncidents([]);
      setMyIncidents([]);

      // Get User Home Base and search for incidents.
      if (authUserProfile?.longitude) {
        const {data, error} = await geoTimedSearchPaged(authUserProfile.longitude, authUserProfile.latitude, localIncidentDistance, user.id, ageInHours, 0, 3, supabase) ;
        setLocalIncidents(data);
      }

      const result = await fetchUserIncidentsPages(authUserProfile.id, null, 0, 3, supabase);
      setMyIncidents(result.data)
      setLoading(false);
    }

    const handleRefresh = async(event: CustomEvent<RefresherEventDetail>) => {
      setTimeout(async () => {
        await loadUserData();
        event.detail.complete();
      }, 2000);
    }

    useEffect(() => {
      //Check for share web api
      const handleAsync = async () => {
        await loadUserData()
      }
      if (authUserProfile) {
        handleAsync();
      }
    }, [authUserProfile]);
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle><img  src="/imgs/WeWatch/WeWatch_LogoStrap_orange.svg" className="h-8"/></IonTitle>
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
        <IonContent className='dark:bg-black bg-red mx-auto'>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <Notifications open={showNotifications} history={history} onDidDismiss={() => setShowNotifications(false)} />
        <div className="flex items-center">
            <div className="rounded-md bg-gray-50 dark:bg-gray-900 p-4 w-full">
              <div className="flex w-full justify-between">
                <p className="text-sm text-gray-500 w-fill">Pull this down to trigger a refresh.</p>
              </div>
            </div>
          </div>  
        
        <div className="mx-2" key="recent-incidents">
          { user && <div className="px-4 pt-4 pb-4 ">
              <h2 className="font-bold text-xl text-gray-600 dark:text-gray-100">Welcome back <span className="font-bold text-xl text-ww-secondary">{authUserProfile?.username}</span></h2>
            </div>
          }

          { user &&
            <label className="block text-sm px-6 font-medium text-gray-700 dark:text-white"  key="recent-incident-label">
                Recent Incidents near you
            </label>
          }
          { user && localIncidents && localIncidents.map((i, index) => (
            <IncidentCardMini key={"local-"+index} onClickFnc={goToIncident} incident={i} />
          ))}

          { !loading && localIncidents && localIncidents.length === 0 && authUserProfile && (authUserProfile.longitude == null || authUserProfile.longitude == 0) &&
            <Card className="my-4 mx-auto" key="profile-location">
              <div className="px-4 pt-10 pb-4  rounded-xl ">
                <h2 className="font-bold text-l text-gray-800 dark:text-gray-100">We need you location..</h2>
                <p className="font-bold text-gray-800 dark:text-gray-100">head over to your profile to add it</p>
              </div>
            </Card>
          }

        {!loading && localIncidents && localIncidents.length === 0 && authUserProfile && authUserProfile.longitude  &&
            <Card className="my-4 mx-auto" key="profile-no-recent">
              <div className="px-4 pt-10 pb-4  rounded-xl ">
                <h2 className="font-bold text-l text-gray-800 dark:text-gray-100">No recent incidents..</h2>
              </div>
            </Card>
          }
       
          {(!user && !loading) && <NoUserCard/>}

          <Card className="my-4 mx-auto" key="advert">
            <div className="px-4 pt-12 pb-4 bg-ww-secondary rounded-xl ">
              <h2 className="font-bold text-l text-gray-800 dark:text-gray-100">This is Ad Space...</h2>
              <p className="font-bold text-gray-800 dark:text-gray-100">Support us and advertise here</p>
            </div>
          </Card>

          { user &&
            <label className="block text-sm px-4 font-medium text-gray-700 dark:text-white"  key="my-incident-label">
                Your Incidents
            </label>
          }

          { user && myIncidents && myIncidents.map((i, index) => (
            <IncidentCardMini key={"my-"+index} onClickFnc={goToIncident} incident={i} />
          ))}

          { !loading &&  user && myIncidents && myIncidents.length === 0 &&
            <Card className="my-4 mx-auto rounded-b-xl" key="my-incident-empy">
              <div className="px-4 pt-10 pb-4  rounded-xl ">
                <h2 className="font-bold text-l text-gray-800 dark:text-gray-100">No Incidents created ..</h2>
                <p className="font-bold text-gray-800 dark:text-gray-100">let us know if there is an issue near by</p>
              </div>
            </Card>
          }



          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Home;

