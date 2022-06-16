import Store from '../../store';
import * as selectors from '../../store/selectors';
import React, { useRef, useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonThumbnail,
  IonImg
} from '@ionic/react';

const ListEntry = ({ list, ...props }) => (
  <IonItem routerLink={`/tabs/lists/${list.id}`} className="list-entry">
    <IonLabel>#{list.id} - {list.name}</IonLabel>

    <IonThumbnail slot="end">
        <IonImg src={list.cover_image} />
    </IonThumbnail>
  </IonItem>
);

const AllLists = ({ onSelect }) => {
  let lists = Store.useState(selectors.getRestAreas);
  return (
    <>
      {lists.map((list, i) => (
        <ListEntry list={list} key={i} />
      ))}

      {lists?.length === 0 && 
        <IonCard>
          <IonItem>
            <IonLabel>Not Rest Areas</IonLabel>
          </IonItem>

          <IonCardContent>
            Search on the Map
          </IonCardContent>
        </IonCard>
      }
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
