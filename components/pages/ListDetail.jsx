import {
  IonBackButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
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

// Create a single supabase client for interacting with your database 
const supabase = createClient('https://arvqjbylexvdpyooykji.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydnFqYnlsZXh2ZHB5b295a2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMxMTk1MzUsImV4cCI6MTk2ODY5NTUzNX0.09341SKltY0PCODodzrDD1RQDXB5tA5dnMc-jQbKPag');

const ListDetail = ({ match }) => {
  const {
    params: { listId },
  } = match;

  const [selectedRestArea, setSelectedRestArea] = useState(null);

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/lists" />
          </IonButtons>
          <IonTitle>#{selectedRestArea?.id} - {selectedRestArea?.name}</IonTitle>
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
