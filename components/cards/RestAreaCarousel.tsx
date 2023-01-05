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

export const RestAreaCarousel = (restarea) => {
  // Blank carousel
  if(restarea?.images == undefined || restarea?.images == null || restarea?.images?.length == 0) return <></>;
  
  let restAreaImages;
  try {
    restAreaImages = JSON.parse(restarea?.images);
  } catch (error) {
    console.error("failed to load restarea images", restarea, error);
  }
  
  return (
    <div className="w-full mx-auto" >
      {/* { restAreaImages ? <IonTitle size="large">Photos</IonTitle> : <IonTitle size="large">No Photos</IonTitle>} */}
      {
        restAreaImages?.map((image, index) => {
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
    
  export default RestAreaCarousel;