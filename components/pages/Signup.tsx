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
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import { Verify } from '../auth/Verify';
  
export const SignupPage = () => {

  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState<string>();
  const [authMode, setAuthMode] = useState<'login' | 'verify' | 'signup' | 'post'>('signup');

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
        {authMode}
            { authMode == 'login' && <Login sendPhoneNumberFnc={callSetPhoneNumber} sendAuthStateFnc={callSetAuthMode} />}
            { authMode == 'signup' && <Signup sendPhoneNumberFnc={callSetPhoneNumber} sendAuthStateFnc={callSetAuthMode} />}
            { authMode == 'verify' && <Verify phoneNumber={phoneNumber} displayPhoneNumber={displayPhoneNumber} sendAuthStateFnc={callSetAuthMode}/>}
            { authMode == 'post' && <p>Logged in, lets TODO next step delayed route</p>}
        </IonContent>
    </IonPage>
    );
  }

  export default SignupPage;
