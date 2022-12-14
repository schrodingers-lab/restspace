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
import UpdatePassword from '../auth/UpdatePAssword';
  
  
export const UpdatePasswordPage = () => {
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
            <UpdatePassword/>
        </IonContent>
    </IonPage>
    );
  }

  export default UpdatePasswordPage;
