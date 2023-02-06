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
  } from '@ionic/react';
  
  import Store from '../../store';
  import * as selectors from '../../store/selectors';
  import { setSettings } from '../../store/actions';
  import React, { use, useState } from 'react';
import { useStore } from '../../store/user';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import distance from '@turf/distance';
import { addHours } from 'date-fns';
import { dateString } from '../util/dates';
import { useEffect } from 'react';
import IncidentCard from '../cards/IncidentCard';
  
  const Home = ({history}) => {
    const settings = Store.useState(selectors.getSettings);
    const [showNotifications, setShowNotifications] = useState(false);
    const [incidents, setIncidents] = useState([]);
    const [localIncidents, setLocalIncidents] = useState([]);
    
    const [myIncidents, setMyIncidents] = useState([]);
    const [error, setError] = useState<string>();
    const supabase = useSupabaseClient();
    const user = useUser();
    const {authUserProfile} = useStore({});

    const geoSearch = async (lng, lat, distance, ageInHours) => {
      const query = supabase
        .rpc('geo_caller_incidents', { x: lng, y: lat, distance: distance, caller_id: user.id });
        
      // still visible
      query.eq('visible', true);
      // number of hours visible
      // query.gt('inserted_at', dateString(addHours(new Date(), -ageInHours)));
      
      
      // temporary-order-creation (not incidented_at, so we see newest, top for clicking)
      const { data, error } = await query.select().order('inserted_at',{ascending: false});
  
      if (error){
        setError(error?.message);
      }

      return data
    }

    const goToIncident = (incident) => {
      if (incident && incident.id){
        history.push('/tabs/incidents/'+incident?.id);
      }
    }

    useEffect(() => {
      //Check for share web api
      const handleAsync = async () => {
        debugger
         // Get User Home Base and search for incidents.
        const localIncidents = await geoSearch(authUserProfile.longitude, authUserProfile.latitude, 1000, 72) ;
        setLocalIncidents(localIncidents)
      }
      if (authUserProfile?.longitude) {
        handleAsync();
        
      }
    }, [authUserProfile]);
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Home</IonTitle>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className='dark:bg-black bg-red'>
          {/* <IonList>
            <IonItem>
              <IonLabel>Enable Notifications</IonLabel>
              <IonToggle
                checked={settings.enableNotifications}
                onIonChange={e => {
                  setSettings({
                    ...settings,
                    enableNotifications: e.target.checked,
                  });
                }}
              />
            </IonItem>
          </IonList> */}
  
          <h2>Welcome back</h2>
          <IonCard>
           TODO
          </IonCard>

            {localIncidents && localIncidents.map((i, index) => (
            <IncidentCard key={index} onClickFnc={goToIncident} incident={i} />
          ))}
  
        </IonContent>
      </IonPage>
    );
  };
  
  export default Home;