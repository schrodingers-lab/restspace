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
  IonImg,
  IonButtons,
  IonMenuButton
} from '@ionic/react';

const ListEntry = ({ list, ...props }) => (
  <IonItem routerLink={`/tabs/lists/${list.id}`} className="list-entry">
    <IonLabel>#{list.id} - {list.name}</IonLabel>

    <IonThumbnail slot="end">
        <IonImg src={list.cover_image_url} />
    </IonThumbnail>
  </IonItem>
);

const AllLists = () => {
  let lists = Store.useState(selectors.getIncidents);
  console.log("lists",lists);
  return (
    <>
      {lists?.length > 0 && lists.map((list, i) => (
        <ListEntry list={list} key={i} />
      ))}

      {lists?.length === 0 && 
        <IonCard>
          <IonItem>
            <IonLabel>No Rest Areas</IonLabel>
          </IonItem>

          <IonCardContent>
            Search on the Map Tab
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
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
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
