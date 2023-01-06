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
import React from 'react';

export const IncidentCarousel = (incident) => {
  // Blank carousel
  if(incident?.images == undefined || incident?.images == null || incident?.images?.length == 0) return <></>;
  
  let incidentImages;
  try {
    incidentImages = JSON.parse(incident?.images);
  } catch (error) {
    console.error("failed to load incident images", incident, error);
  }
  
  return (
    <div className="w-full mx-auto" >
      {/* { incidentImages ? <IonTitle size="large">Photos</IonTitle> : <IonTitle size="large">No Photos</IonTitle>} */}
      {
        incidentImages?.map((image, index) => {
          return (
            <div key={index} className="w-full my-2 mx-auto">
              <img src={image} alt="rest area image" />
            </div>
          );
        })
      }
    </div>
  );
}
    
  export default IncidentCarousel;