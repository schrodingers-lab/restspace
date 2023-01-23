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
import { displayCoverImage } from '../util/display';

const ListEntry = ({ list, ...props }) => {
  const img0 = displayCoverImage(list?.cover_image_url);
  return (
  <IonItem routerLink={`/tabs/incidents/${list.id}`} className="list-entry">
    <IonLabel>#{list.id} - {list.name}</IonLabel>
    {/* TODO add icons for incidents */}
    <IonThumbnail slot="end">
        <IonImg src={img0} />
    </IonThumbnail>
  </IonItem>
)};

const AllLists = () => {
  let incidents = Store.useState(selectors.getIncidents);
  console.log("incidents",incidents);
  return (
    <>
      {incidents?.length > 0 && incidents.map((list, i) => (
        <ListEntry list={list} key={i} />
      ))}

      {incidents?.length === 0 && 
        <IonCard>
          <IonItem>
            <IonLabel>No Incidents Loaded</IonLabel>
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
