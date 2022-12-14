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
  } from '@ionic/react';
import React from 'react';
import Forgot from '../auth/Forgot';
  
  
export const ForgotPage = () => {
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
            <Forgot/>
        </IonContent>
    </IonPage>
    );
  }

  export default ForgotPage;
