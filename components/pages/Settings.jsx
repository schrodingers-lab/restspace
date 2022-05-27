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

import Store from '../../store';
import * as selectors from '../../store/selectors';
import { setSettings } from '../../store/actions';

const Settings = () => {
  const settings = Store.useState(selectors.getSettings);
  const appVersion = 2.3;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
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
            <IonLabel>App Version {appVersion}</IonLabel>
          </IonItem>

          <IonCardContent>
            If you and issue please email support at <a href="mailto:restspace@proroute.co">restspace@proroute.co</a>
          </IonCardContent>
          <IonCardContent>
            We hope you find this product useful but we accept no liability for usage or information supply.
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Settings;
