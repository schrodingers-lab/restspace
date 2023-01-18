import React, {useState} from 'react';
import {
  IonFab,
  IonFabButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonItem,
  IonIcon,
  IonToast,
  IonLabel,
  IonContent,
  IonMenuButton,
  IonFabList,
} from '@ionic/react';

import { eye, easel } from 'ionicons/icons';

function MapInfo(props) {
  const { incident, history } = props;
  const displayName = `#${incident?.id} - ${incident?.name}`;
  const incident_url = incident?.cover_image_url;
  const [isVisible, setIsVisible] = useState(false);

  const handleImage = () => {
    setIsVisible(true);
  }

  const handleClick = () => {
    history.push(`/tabs/incidents/${incident.id}`);
  }

  return (
    <div >
       <h2 className="font-bold text-gray-800">{displayName}</h2>
      {/* Too many images loading on search */}
      {isVisible && <img width={240} src={incident?.cover_image_url} loading="lazy"/>}


      <IonButton onClick={() => handleClick()}> 
        <IonIcon slot="start" icon={eye} />
          More
      </IonButton>

      {!isVisible &&
      <IonButton onClick={() => handleImage()} >
        <IonIcon slot="start" icon={easel} />
        Image
      </IonButton>
      }
    </div>
  );
}

export default React.memo(MapInfo);