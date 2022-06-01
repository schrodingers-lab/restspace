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

export const RestAreaCarousel = (restarea) => {
  if(restarea?.images == undefined || restarea?.images == null || restarea?.images == []) return;
  
  let restAreaImages;
  try {
    restAreaImages = JSON.parse(restarea?.images);
  } catch (error) {
    console.error("failed to load restarea images", restarea, error);
  }
  

  console.log("restAreaImages",restAreaImages)
  return (
    <div className="w-full" >
      { restAreaImages ? <IonTitle size="large">Photos</IonTitle> : <IonTitle size="large">No Photos</IonTitle>}
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