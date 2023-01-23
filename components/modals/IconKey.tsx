import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonNote,
    IonLabel,
    IonListHeader,
  } from '@ionic/react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { close } from 'ionicons/icons';
import React from 'react';
import UserProfileAvatar from '../ui/UserProfileAvatar';

import { moon } from 'ionicons/icons';

const IconKey = ({ open, onDidDismiss }) => {  

    return (
      <IonModal isOpen={open} onDidDismiss={onDidDismiss}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Icon Key - Categories</IonTitle>
            <IonButton slot="end" fill="clear" color="primary" onClick={onDidDismiss}>
              <IonIcon icon={close} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
        <IonList>
          <IonListHeader>
            <IonLabel>Level 1</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonIcon slot="start" src="/svgs/wewatch/stolen-vehicle.svg" color="primary"/>
            <IonLabel>Stolen Vehicle</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" src="/svgs/wewatch/break-enter.svg" color="primary"/>
            <IonLabel>Break and Enter</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" src="/svgs/wewatch/property-damage.svg" color="primary"/>
            <IonLabel>Property Damage</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" src="/svgs/wewatch/violence-threats.svg" color="primary"/>
            <IonLabel>Violence Threat</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" src="/svgs/wewatch/theft.svg"  color="primary"/>
            <IonLabel>Theft</IonLabel>
          </IonItem>
          <IonListHeader>
            <IonLabel>Level 2</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonIcon slot="start" src="/svgs/wewatch/loitering.svg" color="secondary"/>
            <IonLabel>Loitering</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" src="/svgs/wewatch/disturbance.svg" color="secondary"/>
            <IonLabel>Disturbance</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" src="/svgs/wewatch/suspicious.svg" color="secondary"/>
            <IonLabel>Suspicious Behaviour</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" src="/svgs/wewatch/unfamiliar-person.svg" color="secondary"/>
            <IonLabel>Unfamiliar Persons</IonLabel>
          </IonItem>    

        </IonList>
        </IonContent>
      </IonModal>
    );
  };
  
  export default IconKey;
  
