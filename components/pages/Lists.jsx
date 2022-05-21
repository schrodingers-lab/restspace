import Store from '../../store';
import * as selectors from '../../store/selectors';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
} from '@ionic/react';

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database 
const supabase = createClient('https://arvqjbylexvdpyooykji.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydnFqYnlsZXh2ZHB5b295a2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMxMTk1MzUsImV4cCI6MTk2ODY5NTUzNX0.09341SKltY0PCODodzrDD1RQDXB5tA5dnMc-jQbKPag')

const ListEntry = ({ list, ...props }) => (
  <IonItem routerLink={`/tabs/lists/${list.id}`} className="list-entry">
    <IonLabel>{list.name}</IonLabel>
  </IonItem>
);

const AllLists = ({ onSelect }) => {
  const lists = Store.useState(selectors.getLists);


  return (
    <>
      {lists.map((list, i) => (
        <ListEntry list={list} key={i} />
      ))}
    </>
  );
};

const Lists = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lists</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Lists</IonTitle>
          </IonToolbar>
        </IonHeader>
        <AllLists />
      </IonContent>
    </IonPage>
  );
};

export default Lists;
