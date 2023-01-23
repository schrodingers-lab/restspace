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
import { Forgot } from '../auth/Forgot';
import { UpdatePassword } from '../auth/UpdatePassword';
import { Verify } from '../auth/Verify';
  
  
export const ForgotPage = ({history}) => {

    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [displayPhoneNumber, setDisplayPhoneNumber] = useState<string>();
    const [authMode, setAuthMode] = useState<'forgot' | 'update' | 'post'>('forgot');

    const displayPhone = (phoneNumber: string) => {
      if (!phoneNumber) return '';
      if (phoneNumber?.length < 4) return phoneNumber;
      return `${'*'.repeat(phoneNumber.length - 4)}${phoneNumber.slice(-4)}`;
    }

    const callSetPhoneNumber = (phoneNumber) => {
      setPhoneNumber(phoneNumber);
      setDisplayPhoneNumber(displayPhone(phoneNumber));
    }

    const handlePost = async() => {
      history.push('/tabs/map');
      //reset state to login
      setTimeout(async () => {
        setAuthMode('forgot');
      }, 1000);
    }
  
    const callSetAuthMode = (verify) => {
      setAuthMode(verify);
      if (verify === 'post'){
        handlePost();
      }
    }
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
            { authMode == 'forgot' && <Forgot sendPhoneNumberFnc={callSetPhoneNumber} sendAuthStateFnc={callSetAuthMode} />}
            { authMode == 'update' && <UpdatePassword phoneNumber={phoneNumber} displayPhoneNumber={displayPhoneNumber} sendAuthStateFnc={callSetAuthMode}/>}
            { authMode == 'post' && <p>loading...</p>}
        </IonContent>
    </IonPage>
    );
  }

  export default ForgotPage;
