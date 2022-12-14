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
import React, { useState } from 'react';
import Forgot from '../auth/Forgot';
import {UpdatePassword} from '../auth/UpdatePassword';
  
  
export const UpdatePasswordPage = () => {

  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState<string>();
  const [authMode, setAuthMode] = useState< 'update' | 'post'>('update');

  const displayPhone = (phoneNumber: string) => {
    return phoneNumber+"TODO***s";
  }

  const callSetPhoneNumber = (phoneNumber) => {
    setPhoneNumber(phoneNumber);
    setDisplayPhoneNumber(displayPhone(phoneNumber));
  }

  const callSetAuthMode = (verify) => {
    debugger;
    setAuthMode(verify);
  }
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
            { authMode == 'update' && <UpdatePassword phoneNumber={phoneNumber} displayPhoneNumber={displayPhoneNumber} sendAuthStateFnc={callSetAuthMode}/>}
            { authMode == 'post' && <p>reset, lets TODO next step delayed route</p>}
        </IonContent>
    </IonPage>
    );
  }

  export default UpdatePasswordPage;
