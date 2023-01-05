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
} from '@ionic/react';

import Store from '../../store';
import * as selectors from '../../store/selectors';
import { setSettings } from '../../store/actions';
import React from 'react';

const Settings = () => {
  const settings = Store.useState(selectors.getSettings);

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
        {/* <IonList>
          <IonItem>
            <IonLabel>Enable Notifications</IonLabel>
            <IonToggle
              checked={settings.enableNotifications}
              onIonChange={e => {
                setSettings({
                  ...settings,
                  enableNotifications: e.target.checked,
                });
              }}
            />
          </IonItem>
        </IonList> */}

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
