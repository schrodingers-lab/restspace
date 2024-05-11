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
  
  
export const UpdatePasswordPage = ({history}) => {

  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState<string>();
  const [authMode, setAuthMode] = useState< 'update' | 'post'>('update');


  const displayPhone = (phoneNumber: string) => {
    if (!phoneNumber) return '';
    if (phoneNumber?.length < 4) return phoneNumber;
    return `${'*'.repeat(phoneNumber.length - 4)}${phoneNumber.slice(-4)}`;
  };

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
            { authMode == 'post' && <p>reset, lets TODO next step delayed route  and reset state</p>}
        </IonContent>
    </IonPage>
    );
  }

  export default UpdatePasswordPage;
