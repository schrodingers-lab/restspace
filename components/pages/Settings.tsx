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
  IonButtons,
  IonMenuButton,
  IonIcon,
} from '@ionic/react';

import { moon } from 'ionicons/icons';
import Store from '../../store';
import * as selectors from '../../store/selectors';
import React, { useState } from 'react';

const Settings = () => {
  const settings = Store.useState(selectors.getSettings);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const handleToggleTheme = () => {
    if (theme === 'light') {
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
      document.documentElement.classList.add('dark'); //tailwind
      document.body.classList.add('dark'); //ionic
    } else {
      localStorage.setItem('theme', 'light');
      setTheme('light');
      document.documentElement.classList.remove('dark'); //tailwind
      document.body.classList.remove('dark'); //ionic
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonIcon slot="start" icon={moon}/>
            <IonLabel>Dark Mode</IonLabel>
            <IonToggle
              checked={theme == 'dark'}
              onIonChange={e => {handleToggleTheme()}}
            />
          </IonItem>
        </IonList>

        <IonCard>
          <IonItem>
            <IonLabel>App Version {settings.appVersion}</IonLabel>
          </IonItem>

          <IonCardContent>
            If you have an issue please email support at <a href="mailto:admin@wewatchapp.com">admin@wewatchapp.com</a>
          </IonCardContent>
          <IonCardContent>
            We hope you find this product useful, we accept no liability for usage or information supplied.
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Settings;
