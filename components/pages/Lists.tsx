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
  IonMenuButton,
  IonSegment,
  IonSegmentButton
} from '@ionic/react';
import { displayCoverImage } from '../util/display';
import CategoriesIcons from '../ui/CategoriesIcons';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

export const ListEntry = ({ incident, ...props }) => {
  const img0 = displayCoverImage(incident?.cover_image_url);
  return (
  <IonItem routerLink={`/tabs/incidents/${incident.id}`} className="incident-entry">
    <IonLabel>#{incident.id} - {incident.name}<br/>
      <CategoriesIcons incident={incident} showAll={false}/>
    </IonLabel>
    <div className="text-ww-primary float-right text-xs">
      {formatDistanceToNow(new Date(incident.inserted_at),{addSuffix: true})}
    </div>
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
      {incidents?.length > 0 && incidents.map((incident, i) => (
        <ListEntry incident={incident} key={i} />
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

const Lists = ({history}) => {

  const handleMapSegment = () =>{
    history.push('/tabs/map');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle><img  src="/imgs/WeWatch/WeWatch_LogoStrap_orange.svg" className="h-8"/></IonTitle>
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
        <IonSegment value="list">
          <IonSegmentButton value="map" onClick={handleMapSegment}>
            Map
          </IonSegmentButton>
          <IonSegmentButton value="list">
            List
          </IonSegmentButton>
        </IonSegment>
        <AllLists />
      </IonContent>
    </IonPage>
  );
};

export default Lists;
