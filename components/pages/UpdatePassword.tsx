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
import { displayPhone } from '../util/display';
  
  
export const UpdatePasswordPage = ({history}) => {

  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState<string>();
  const [authMode, setAuthMode] = useState< 'update' | 'post'>('update');

  const callSetPhoneNumber = (phoneNumber) => {
    setPhoneNumber(phoneNumber);
    setDisplayPhoneNumber(displayPhone(phoneNumber));
  }

  const handlePost = async() => {
    history.push('/tabs/map');
    //reset state to login
    setTimeout(async () => {
      setAuthMode('update');
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
            { authMode == 'update' && <UpdatePassword phoneNumber={phoneNumber} displayPhoneNumber={displayPhoneNumber} sendAuthStateFnc={callSetAuthMode}/>}
            { authMode == 'post' && <p>Password reset...</p>}
        </IonContent>
    </IonPage>
    );
  }

  export default UpdatePasswordPage;
